import { ShieldCheck } from "lucide-react";

export function PhysicalDisclaimer() {
  return <aside aria-labelledby="physical-disclaimer-title" className="mt-12 border-t-2 border-amber pt-6 text-sm leading-relaxed text-muted-foreground">
    <h2 id="physical-disclaimer-title" className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
      <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-deep" />
      Health &amp; Safety Disclaimer
    </h2>
    <p>This information is for general education only. It is not medical advice, physiotherapy, or an individual exercise or treatment prescription, and it does not replace assessment by a qualified professional. Exercise, breathing techniques, temperature exposure and other physical practices can carry risks and may not be appropriate for everyone.</p>
    <p className="mt-3">Before beginning a new physical practice or significantly increasing your activity, consult your GP or an appropriately qualified healthcare or exercise professional about your individual health, medical history, medicines, abilities and circumstances. Begin from your current level, build up gradually with suitable guidance, and stop and seek advice if you experience pain, dizziness, unusual breathlessness or other concerning symptoms. No article can cover every consideration or guarantee safety or benefits.</p>
  </aside>;
}