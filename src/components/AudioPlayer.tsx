'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title: string
  onPlay?: () => void
  isCurrentlyPlaying?: boolean
}

export default function AudioPlayer({
  src,
  title,
  onPlay,
  isCurrentlyPlaying = false,
}: AudioPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Stop when another player starts
  useEffect(() => {
    if (!isCurrentlyPlaying && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }, [isCurrentlyPlaying, isPlaying])

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(src)
    audio.volume = volume
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [src, volume])

  // Initialize Web Audio API for visualization
  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return

    const audioContext = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    const source = audioContext.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source
  }, [])

  // Draw waveform visualization
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgba(18, 18, 26, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(
          0,
          canvas.height - barHeight,
          0,
          canvas.height
        )
        gradient.addColorStop(0, '#a855f7')
        gradient.addColorStop(0.5, '#22d3ee')
        gradient.addColorStop(1, '#f472b6')

        ctx.fillStyle = gradient
        ctx.fillRect(
          x,
          canvas.height - barHeight,
          barWidth - 2,
          barHeight
        )

        x += barWidth
      }
    }

    draw()
  }, [])

  // Draw static waveform when paused
  const drawStaticWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#12121a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const bars = 50
    const barWidth = canvas.width / bars

    for (let i = 0; i < bars; i++) {
      const barHeight =
        Math.sin((i / bars) * Math.PI) * canvas.height * 0.3 +
        Math.random() * 10

      const gradient = ctx.createLinearGradient(
        0,
        canvas.height / 2 - barHeight / 2,
        0,
        canvas.height / 2 + barHeight / 2
      )
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)')
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.5)')
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)')

      ctx.fillStyle = gradient
      ctx.fillRect(
        i * barWidth + 2,
        canvas.height / 2 - barHeight / 2,
        barWidth - 4,
        barHeight
      )
    }
  }, [])

  // Draw initial static waveform
  useEffect(() => {
    drawStaticWaveform()
  }, [drawStaticWaveform])

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (!audioContextRef.current) {
      initAudioContext()
    }

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    if (isPlaying) {
      audioRef.current.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      drawStaticWaveform()
    } else {
      onPlay?.()
      await audioRef.current.play()
      drawWaveform()
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full space-y-3">
      {/* Waveform Visualization */}
      <div className="waveform-container rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={60}
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center text-white shadow-neon-purple"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isLoaded && src !== ''}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </motion.button>

        {/* Progress */}
        <div className="flex-1 space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-cyan [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #22d3ee ${
                (currentTime / (duration || 1)) * 100
              }%, #1e1e2e ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-text-muted font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={toggleMute} className="text-text-muted hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-purple [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #a855f7 ${
                (isMuted ? 0 : volume) * 100
              }%, #1e1e2e ${(isMuted ? 0 : volume) * 100}%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
