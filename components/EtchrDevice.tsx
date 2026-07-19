import { ComparisonSlider } from "@/components/ComparisonSlider";

export function EtchrDevice() {
  return (
    <div
      className="etchr-device"
      role="group"
      aria-label="Responsive Etchr portrait experience"
    >
      <div className="device-speaker" aria-hidden="true" />
      <div className="device-browser-bar">
        <span className="device-browser-mark" aria-hidden="true">
          E
        </span>
        <span>etchr.ai</span>
      </div>
      <ComparisonSlider compact />
      <div className="device-footer">
        <span>Responsive product experience</span>
        <span aria-hidden="true">01 / 03</span>
      </div>
    </div>
  );
}
