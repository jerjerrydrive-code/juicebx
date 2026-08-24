package com.example.juicebx

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.content.pm.ServiceInfo
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import androidx.core.app.NotificationCompat
import androidx.media.app.NotificationCompat.MediaStyle
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.URL

class MediaPlaybackService : Service() {

    private var mediaSession: MediaSessionCompat? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private val CHANNEL_ID = "juicebx_media_playback"
    private val NOTIFICATION_ID = 999

    companion object {
        const val ACTION_PLAY = "com.example.juicebx.ACTION_PLAY"
        const val ACTION_PAUSE = "com.example.juicebx.ACTION_PAUSE"
        const val ACTION_PREV = "com.example.juicebx.ACTION_PREV"
        const val ACTION_NEXT = "com.example.juicebx.ACTION_NEXT"
        const val ACTION_UPDATE = "com.example.juicebx.ACTION_UPDATE"

        const val EXTRA_TITLE = "extra_title"
        const val EXTRA_ARTIST = "extra_artist"
        const val EXTRA_THUMB = "extra_thumb"
        const val EXTRA_IS_PLAYING = "extra_is_playing"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        // Acquire Partial WakeLock to keep audio thread alive with screen locked
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "JuiceBx:AudioKeepAlive")
        wakeLock?.acquire(12 * 60 * 60 * 1000L) // 12 hours max

        mediaSession = MediaSessionCompat(this, "JuiceBxSession").apply {
            setCallback(object : MediaSessionCompat.Callback() {
                override fun onPlay() {
                    sendBroadcast(Intent(ACTION_PLAY))
                }
                override fun onPause() {
                    sendBroadcast(Intent(ACTION_PAUSE))
                }
                override fun onSkipToNext() {
                    sendBroadcast(Intent(ACTION_NEXT))
                }
                override fun onSkipToPrevious() {
                    sendBroadcast(Intent(ACTION_PREV))
                }
            })
            isActive = true
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == ACTION_UPDATE) {
            val title = intent.getStringExtra(EXTRA_TITLE) ?: "JuiceBx 999"
            val artist = intent.getStringExtra(EXTRA_ARTIST) ?: "Juice WRLD"
            val thumb = intent.getStringExtra(EXTRA_THUMB) ?: ""
            val isPlaying = intent.getBooleanExtra(EXTRA_IS_PLAYING, true)

            updateMediaNotification(title, artist, thumb, isPlaying)
        } else if (action == ACTION_PLAY || action == ACTION_PAUSE || action == ACTION_NEXT || action == ACTION_PREV) {
            sendBroadcast(Intent(action))
        }

        return START_STICKY
    }

    private fun updateMediaNotification(title: String, artist: String, thumbUrl: String, isPlaying: Boolean) {
        val state = if (isPlaying) PlaybackStateCompat.STATE_PLAYING else PlaybackStateCompat.STATE_PAUSED
        mediaSession?.setPlaybackState(
            PlaybackStateCompat.Builder()
                .setActions(
                    PlaybackStateCompat.ACTION_PLAY or
                    PlaybackStateCompat.ACTION_PAUSE or
                    PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                    PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
                )
                .setState(state, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 1.0f)
                .build()
        )

        val mainIntent = Intent(this, MainActivity::class.java)
        val contentPendingIntent = PendingIntent.getActivity(
            this, 0, mainIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val prevPending = PendingIntent.getService(
            this, 1, Intent(this, MediaPlaybackService::class.java).apply { action = ACTION_PREV },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val playPausePending = PendingIntent.getService(
            this, 2, Intent(this, MediaPlaybackService::class.java).apply { action = if (isPlaying) ACTION_PAUSE else ACTION_PLAY },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val nextPending = PendingIntent.getService(
            this, 3, Intent(this, MediaPlaybackService::class.java).apply { action = ACTION_NEXT },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val playPauseIcon = if (isPlaying) android.R.drawable.ic_media_pause else android.R.drawable.ic_media_play

        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(artist)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(contentPendingIntent)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .addAction(android.R.drawable.ic_media_previous, "Previous", prevPending)
            .addAction(playPauseIcon, if (isPlaying) "Pause" else "Play", playPausePending)
            .addAction(android.R.drawable.ic_media_next, "Next", nextPending)
            .setStyle(
                MediaStyle()
                    .setMediaSession(mediaSession?.sessionToken)
                    .setShowActionsInCompactView(0, 1, 2)
            )
            .setOngoing(isPlaying)

        val notification = builder.build()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        // Async fetch artwork if provided
        if (thumbUrl.isNotEmpty()) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val stream = URL(thumbUrl).openStream()
                    val bitmap = BitmapFactory.decodeStream(stream)
                    if (bitmap != null) {
                        builder.setLargeIcon(bitmap)
                        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                        manager.notify(NOTIFICATION_ID, builder.build())
                    }
                } catch (e: Exception) {}
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "JuiceBx Media Playback",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Controls background audio for JuiceBx"
                setShowBadge(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaSession?.release()
        if (wakeLock?.isHeld == true) {
            wakeLock?.release()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
