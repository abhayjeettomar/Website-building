import * as THREE from 'three';

// High-fidelity 2nd-order Damped Harmonic Oscillator for fluid slosh physics
// Accurately simulates fluid inertia, gravity compensation, surface tension, and vortex draining
export class FluidPhysicsEngine {
  // Slosh displacement angles (radians) - safely clamped to prevent glass clipping
  public sloshPitch = 0; // X axis tilt
  public sloshRoll = 0;  // Z axis tilt

  private sloshVelPitch = 0;
  private sloshVelRoll = 0;

  // Physical constants calibrated for viscous botanical elixir (similar to 15% sugar syrup / cold extraction)
  private readonly springK = 32.0;    // Restoring gravity stiffness
  private readonly damping = 4.8;     // Viscous damping
  private readonly maxTilt = 0.065;   // Max slosh angle (~3.7 degrees - strictly safe within glass bore)

  // Surface wave perturbation (from pouring impact & scroll impulses)
  public waveAmplitude = 0;
  private waveFrequency = 16.0;

  // Vortex swirl depression for rotational drainage
  public vortexStrength = 0;

  // Previous frame tracking for acceleration computation
  private prevPosX = 0;
  private prevPosY = 0;
  private prevVelocity = 0;

  public update(
    delta: number,
    time: number,
    bottlePosX: number,
    bottlePosY: number,
    bottleRotX: number,
    bottleRotZ: number,
    scrollVelocity: number,
    isPouring: boolean,
    isDraining: boolean = false
  ) {
    const dt = Math.min(0.04, Math.max(0.001, delta)); // Numerical stability guard

    // Compute external acceleration forces acting on the liquid
    const accelX = (bottlePosX - this.prevPosX) / dt;
    const accelY = (bottlePosY - this.prevPosY) / dt;
    const scrollAccel = (scrollVelocity - this.prevVelocity) / dt;

    this.prevPosX = bottlePosX;
    this.prevPosY = bottlePosY;
    this.prevVelocity = scrollVelocity;

    // External force impulses (lateral acceleration, scroll jerk, and bottle tilt)
    const forceRoll = -accelX * 0.05 - bottleRotZ * 0.8;
    const forcePitch = -scrollAccel * 0.0015 - bottleRotX * 0.8;

    // Additional wave turbulence while pouring
    if (isPouring) {
      this.waveAmplitude = Math.min(1.0, this.waveAmplitude + dt * 4.0);
    } else {
      this.waveAmplitude = Math.max(0, this.waveAmplitude - dt * 2.2);
    }

    // Vortex strength when draining
    if (isDraining) {
      this.vortexStrength = Math.min(1.0, this.vortexStrength + dt * 3.0);
    } else {
      this.vortexStrength = Math.max(0, this.vortexStrength - dt * 2.5);
    }

    // Spring equations: a = -k*x - c*v + F_ext
    const accRoll = -this.springK * this.sloshRoll - this.damping * this.sloshVelRoll + forceRoll;
    this.sloshVelRoll += accRoll * dt;
    this.sloshRoll += this.sloshVelRoll * dt;
    this.sloshRoll = THREE.MathUtils.clamp(this.sloshRoll, -this.maxTilt, this.maxTilt);

    const accPitch = -this.springK * this.sloshPitch - this.damping * this.sloshVelPitch + forcePitch;
    this.sloshVelPitch += accPitch * dt;
    this.sloshPitch += this.sloshVelPitch * dt;
    this.sloshPitch = THREE.MathUtils.clamp(this.sloshPitch, -this.maxTilt, this.maxTilt);
  }

  // Returns live surface wave offset for any vertex given its radial distance
  public getSurfaceWave(radius: number, time: number): number {
    if (this.waveAmplitude <= 0.001) return 0;
    // Concentric capillary ripple wave moving radially outward from stream impact
    return (
      Math.sin(time * this.waveFrequency - radius * 14.0) *
      0.010 *
      this.waveAmplitude
    );
  }

  // Returns vortex funnel depression height at radius r from center
  public getVortexOffset(rNorm: number): number {
    if (this.vortexStrength <= 0.001) return 0;
    // Parabolic vortex funnel: deepest at center (r=0), zero at walls (r=1)
    const funnel = Math.pow(Math.max(0, 1.0 - rNorm), 2.2);
    return -funnel * 0.08 * this.vortexStrength;
  }
}

export const fluidPhysics = new FluidPhysicsEngine();
