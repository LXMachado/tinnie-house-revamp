export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24">
      <div className="container max-w-4xl">
        <div className="blur-card p-8 lg:p-12">
          <h1 className="font-orbitron text-3xl lg:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Information We Collect</h2>
              <p className="mb-4">
                At Tinnie House Records, we collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Submit music demos or contact forms</li>
                <li>Subscribe to our newsletter</li>
                <li>Follow us on social media platforms</li>
                <li>Purchase or stream our music releases</li>
              </ul>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your inquiries and demo submissions</li>
                <li>Send you updates about new releases and label news</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except as described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us through our contact form 
                or email us directly.
              </p>
            </section>

            <section className="text-sm text-center border-t border-border/50 pt-6">
              <p>Last updated: June 15, 2025</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}