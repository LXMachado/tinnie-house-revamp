export default function CookiePolicy() {
  return (
    <div className="min-h-screen py-24">
      <div className="container max-w-4xl">
        <div className="blur-card p-8 lg:p-12">
          <h1 className="font-orbitron text-3xl lg:text-4xl font-bold mb-8 text-center">Cookie Policy</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">What Are Cookies</h2>
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us make your experience better by remembering your preferences and visits.
              </p>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remembering your theme preferences (dark/light mode)</li>
                <li>Keeping you logged in if you have an account</li>
                <li>Understanding how you use our website to improve it</li>
                <li>Providing personalized content and recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the website to function properly. They cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                  <p>These cookies remember your choices and preferences to provide a personalized experience.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                  <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Third-Party Cookies</h2>
              <p className="mb-4">We may use third-party services that set their own cookies:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Social media platforms (when you interact with our social content)</li>
                <li>Music streaming platforms (for embedded players)</li>
                <li>Analytics services (to understand website usage)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Managing Cookies</h2>
              <p className="mb-4">You can control and manage cookies in several ways:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use your browser settings to block or delete cookies</li>
                <li>Set your browser to notify you when cookies are being sent</li>
                <li>Use browser extensions that manage cookies</li>
              </ul>
              <p className="mt-4">
                Note that disabling cookies may affect the functionality of our website and your user experience.
              </p>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="font-orbitron text-xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us through our contact form.
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