/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple robust Haptic Feedback system for web browsers
// Supports physical vibration on mobile clients & high-fidelity customized synthesised click ticks for all devices.

export function triggerHaptic() {
  // 1. Physical Device Vibration
  try {
    const settingsStr = localStorage.getItem('adv_num_conv_settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : { hapticsEnabled: true, soundEnabled: true };

    if (settings.hapticsEnabled !== false && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15); // subtle mechanical touch feed
    }
  } catch (e) {
    // Fail silently, safe for sandbox iframe
  }

  // 2. Synthesized Mechanical Clicking Audio
  try {
    const settingsStr = localStorage.getItem('adv_num_conv_settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : { hapticsEnabled: true, soundEnabled: true };

    if (settings.soundEnabled !== false) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          // Playback is restricted by browser until interaction (which is this click, so we call resume)
          ctx.resume();
        }
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Classic mechanical touch frequency
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, ctx.currentTime); // Crisp click pitch
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.012); // Drop decay
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime); // Low non-intrusive volume
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015); // fast release
        
        osc.start();
        osc.stop(ctx.currentTime + 0.015);
      }
    }
  } catch (e) {
    // Fail silently if restricted inside iframe policies
  }
}

// Crisp buzz beep for success actions
export function triggerSuccessBeep() {
  try {
    const settingsStr = localStorage.getItem('adv_num_conv_settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : { hapticsEnabled: true, soundEnabled: true };

    if (settings.soundEnabled !== false) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // pleasant 440hz note
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05); // pleasant high harmony
        
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    }
  } catch (e) {
    // Safe fallback
  }
}
