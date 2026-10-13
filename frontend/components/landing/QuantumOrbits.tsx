export default function QuantumOrbits() {
  return (
    <div className="quantum-field" aria-hidden="true">
      <svg className="orbit-svg" viewBox="0 0 900 650" preserveAspectRatio="none">
        <path id="orbit-track-main" d="M 30 325 A 420 155 0 1 0 870 325 A 420 155 0 1 0 30 325" fill="none" />
        <path id="orbit-track-cross" d="M 45 325 A 405 145 0 1 0 855 325 A 405 145 0 1 0 45 325" transform="rotate(30 450 325)" fill="none" />
        <path id="orbit-track-cross-two" d="M 295 325 A 155 275 0 1 0 605 325 A 155 275 0 1 0 295 325" fill="none" />

        <circle className="orbit-particle particle-a" r="4" fill="#6ee7ff">
          <animateMotion dur="23s" repeatCount="indefinite"><mpath href="#orbit-track-main" /></animateMotion>
        </circle>
        <circle className="orbit-particle particle-b" r="4.2" fill="#e879f9">
          <animateMotion dur="31s" begin="-8s" repeatCount="indefinite"><mpath href="#orbit-track-cross" /></animateMotion>
        </circle>
        <circle className="orbit-particle particle-c" r="3.2" fill="#818cf8">
          <animateMotion dur="37s" begin="-13s" repeatCount="indefinite"><mpath href="#orbit-track-cross-two" /></animateMotion>
        </circle>
        <circle className="orbit-particle particle-d" r="2.7" fill="#60a5fa">
          <animateMotion dur="29s" begin="-5s" repeatCount="indefinite"><mpath href="#orbit-track-main" /></animateMotion>
        </circle>
      </svg>
    </div>
  );
}