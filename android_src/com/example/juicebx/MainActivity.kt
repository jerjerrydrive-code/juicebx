package com.example.juicebx

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.View
import android.view.WindowManager
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

import androidx.webkit.WebViewAssetLoader

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var vibrator: Vibrator? = null

    private val mediaControlReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                MediaPlaybackService.ACTION_PLAY -> webView.evaluateJavascript("if(window.JuiceEngine) window.JuiceEngine.togglePlay(); else if(window.engine) window.engine.togglePlay();", null)
                MediaPlaybackService.ACTION_PAUSE -> webView.evaluateJavascript("if(window.JuiceEngine) window.JuiceEngine.togglePlay(); else if(window.engine) window.engine.togglePlay();", null)
                MediaPlaybackService.ACTION_NEXT -> webView.evaluateJavascript("if(window.JuiceEngine) window.JuiceEngine.next(); else if(window.engine) window.engine.next();", null)
                MediaPlaybackService.ACTION_PREV -> webView.evaluateJavascript("if(window.JuiceEngine) window.JuiceEngine.prev(); else if(window.engine) window.engine.prev();", null)
            }
        }
    }

    override fun onPause() {
        super.onPause()
        // Do not pause webView to allow continuous background audio playback
    }

    override fun onStop() {
        super.onStop()
        // Do not suspend webView timers
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Make window edge-to-edge
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        // Initialize Hardware Vibrator
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vibratorManager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }

        // Request Notification Permission for Background Controls on Android 13+ (Tiramisu / 14 / 15)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 101)
            }
        }

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            setBackgroundColor(Color.parseColor("#080911"))
            setLayerType(View.LAYER_TYPE_HARDWARE, null)

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                mediaPlaybackRequiresUserGesture = false
                allowFileAccess = true
                allowContentAccess = true
                cacheMode = WebSettings.LOAD_DEFAULT
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                useWideViewPort = true
                loadWithOverviewMode = true
                userAgentString = "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 JuiceBx/3.2"
                allowUniversalAccessFromFileURLs = true
                allowFileAccessFromFileURLs = true
                javaScriptCanOpenWindowsAutomatically = true
                setSupportZoom(false)
            }

            val adHosts = listOf(
                "doubleclick.net",
                "googleads.g.doubleclick.net",
                "pagead2.googlesyndication.com",
                "adservice.google.com",
                "pubads.g.doubleclick.net",
                "securepubads.g.doubleclick.net"
            )

            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                    android.util.Log.d("JuiceBxWeb", "${consoleMessage?.message()} -- Line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}")
                    return true
                }
            }

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView?,
                    request: WebResourceRequest?
                ): WebResourceResponse? {
                    val urlStr = request?.url?.toString() ?: return null
                    // Ad blocking for ad scripts / trackers
                    if (adHosts.any { urlStr.contains(it) }) {
                        return WebResourceResponse("text/plain", "UTF-8", java.io.ByteArrayInputStream(ByteArray(0)))
                    }
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    return false
                }
            }

            addJavascriptInterface(JuiceAndroidBridge(), "JuiceNative")
            loadUrl("https://appassets.androidplatform.net/assets/index.html")
        }

        setContentView(webView)

        // Register Media Control Broadcasts from Notification
        val filter = IntentFilter().apply {
            addAction(MediaPlaybackService.ACTION_PLAY)
            addAction(MediaPlaybackService.ACTION_PAUSE)
            addAction(MediaPlaybackService.ACTION_NEXT)
            addAction(MediaPlaybackService.ACTION_PREV)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(mediaControlReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(mediaControlReceiver, filter)
        }
    }

    inner class JuiceAndroidBridge {
        @JavascriptInterface
        fun postPlaybackState(title: String, artist: String, thumb: String, isPlaying: Boolean) {
            val intent = Intent(this@MainActivity, MediaPlaybackService::class.java).apply {
                action = MediaPlaybackService.ACTION_UPDATE
                putExtra(MediaPlaybackService.EXTRA_TITLE, title)
                putExtra(MediaPlaybackService.EXTRA_ARTIST, artist)
                putExtra(MediaPlaybackService.EXTRA_THUMB, thumb)
                putExtra(MediaPlaybackService.EXTRA_IS_PLAYING, isPlaying)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent)
            } else {
                startService(intent)
            }
        }

        @JavascriptInterface
        fun triggerHaptic(durationMs: Long) {
            if (vibrator?.hasVibrator() == true) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(durationMs)
                }
            }
        }
    }

    override fun onBackPressed() {
        webView.evaluateJavascript(
            "(function() { " +
            "  var modal = document.getElementById('player-modal'); " +
            "  if (modal && modal.style.transform === 'translateY(0px)') { " +
            "    modal.style.transform = 'translateY(100%)'; return true; " +
            "  } " +
            "  var container = document.getElementById('app-container'); " +
            "  if (container && container.scrollLeft > 50) { " +
            "    container.scrollTo({ left: 0, behavior: 'smooth' }); return true; " +
            "  } " +
            "  return false; " +
            "})()"
        ) { result ->
            if (result != "true") {
                super.onBackPressed()
            }
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        // Keep webView timers active regardless of window focus
        webView.resumeTimers()
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(mediaControlReceiver)
        } catch (e: Exception) {}
    }
}
