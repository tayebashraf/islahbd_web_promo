import React from 'react';
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Privacy Policy | IslahBD Mobile Application',
};

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.wrapper}>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
            <div className="grid-bg"></div>

            <header>
                <div className="label-pill">Google Play Developer Policy Compliance Document</div>
                <h1>Privacy Policy</h1>
                <div className="subtitle">IslahBD: Non-Tracking Spiritual Companion Application</div>
            </header>

            <div className="container">
                <div className="info-grid">
                    <div className="info-card">
                        <span>Developer / Entity</span>
                        <strong>Muhmmad Tayeb Ashraf</strong>
                    </div>
                    <div className="info-card">
                        <span>Application Name</span>
                        <strong>IslahBD</strong>
                    </div>
                    <div className="info-card">
                        <span>Application Package</span>
                        <strong>com.islahbd.app</strong>
                    </div>
                    <div className="info-card">
                        <span>Effective Date</span>
                        <strong>June 1, 2026</strong>
                    </div>
                </div>

                <section>
                    <h2><div className="section-num">1</div>Introduction & Core Commitment</h2>
                    <p>This Privacy Policy outlines how <strong>Muhmmad Tayeb Ashraf</strong> ("we", "our", or "us") manages personal information and system access inside the <strong>IslahBD</strong> mobile application (the "App"). We hold consumer privacy in the highest regard, especially within digital tools meant for prayer tracking and spiritual assistance.</p>
                    <p>To establish explicit transparency under the <strong>Google Play Developer Program Policies</strong> regarding user transparency, this document details how our app accesses device hardware features. IslahBD is fundamentally architected as a <strong>Zero-Data-Collection Application</strong>. We do not provision client server instances, and we do not compile behavioral profiling or metadata on our users.</p>
                </section>

                <section>
                    <h2><div className="section-num">2</div>Comprehensive Data & Permission Matrix</h2>
                    <p>Google Play User Data Policies require explicit declarations of sensitive device permissions. Below is an exhaustive breakdown of the hardware capabilities requested by IslahBD, detailing exactly why they are required and how they are isolated:</p>

                    <div className="data-table-wrapper">
                        <table className="data-matrix">
                            <thead>
                                <tr>
                                    <th>Android Permission / Data Category</th>
                                    <th>Collection Status</th>
                                    <th>Core Purpose & Functional Necessity</th>
                                    <th>Storage / Transfer Protocol</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>ACCESS_FINE_LOCATION</strong><br />(Precise GPS Coordinates)</td>
                                    <td><strong style={{ color: '#E53935' }}>NOT COLLECTED</strong></td>
                                    <td>Required directly to run immediate, local geometric math equations against global geographical grids to compute the precise angular direction of the Qibla (Kaaba compass orientation).</td>
                                    <td><strong>On-Device Transient Memory Only:</strong> Processed instantly in volatile runtime RAM. Never written to permanent disk storage; never transmitted over the internet to any remote cloud servers.</td>
                                </tr>
                                <tr>
                                    <td><strong>ACCESS_COARSE_LOCATION</strong><br />(Approximate Network Location)</td>
                                    <td><strong style={{ color: '#E53935' }}>NOT COLLECTED</strong></td>
                                    <td>Required to automatically parse regional time zones and city location clusters. This determines accurate astronomical calculations for daily localized Islamic Prayer Times (Salah timelines).</td>
                                    <td><strong>On-Device Isolation:</strong> Evaluated inside the client software layer sandbox environment. Completely isolated from external endpoints.</td>
                                </tr>
                                <tr>
                                    <td><strong>POST_NOTIFICATIONS</strong><br />(Push Notification Handling)</td>
                                    <td><strong style={{ color: '#E53935' }}>NOT COLLECTED</strong></td>
                                    <td>Required to fire prompt triggers regarding ongoing live bayans, regional islamic alerts, or custom operational schedule notices.</td>
                                    <td><strong>Local Device Triggers:</strong> Managed natively via the local system notification registry. No centralized tracking tags attached.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="alert-box">
                        <strong>Google Play Developer Policy Compliance Affirmation:</strong>
                        Pursuant to the <em>Google Play Personal and Sensitive User Data Policy</em>, we explicitly declare that IslahBD does NOT transmit, share, upload, or sell your precise or approximate location details, device identifier hashes, or internal device parameters to any developer system, ad network, analytics provider, or external third-party infrastructure.
                    </div>
                </section>

                <section>
                    <h2><div className="section-num">3</div>No Account Registration & Anonymous Accessibility</h2>
                    <p>To maximize security and eliminate compliance liabilities, IslahBD bypasses traditional cloud account generation systems entirely:</p>
                    <ul>
                        <li><strong>No Authentication Controls:</strong> Users access 100% of the internal application modules without logging in, providing email addresses, phone contacts, or authenticating profile metrics.</li>
                        <li><strong>No Session Logs:</strong> There are no developer backend logs detailing which interfaces are tapped, ensuring total anonymity.</li>
                        <li><strong>Absence of Third-Party Ad Networks:</strong> IslahBD does not use third-party programmatic advertisement banners or surveillance marketing software development kits (SDKs), preventing covert device profiling.</li>
                    </ul>
                </section>

                <section>
                    <h2><div className="section-num">4</div>Data Storage, Retention, and Right to Deletion</h2>
                    <p>Because IslahBD does not store or process your personal data on any server, there is no personal data held in the cloud to delete. This architectural model provides users with ultimate data sovereignty.</p>
                    <p>Any local configurations or system variables chosen by the user are stored entirely within the device’s private sandbox storage space. To reset, wipe, or request absolute deletion of this local configuration cache, follow the manual clearing protocol below:</p>

                    <div className="action-box">
                        <strong className="title">Complete Local Data Deletion Steps:</strong>
                        <ol className="protocol-list" style={{ margin: 0, paddingLeft: '15px' }}>
                            <li>Open your device's primary <strong>Settings</strong> interface.</li>
                            <li>Navigate to the <strong>Apps</strong> or <strong>Application Manager</strong> category.</li>
                            <li>Locate and select <strong>IslahBD</strong> from the device application registry.</li>
                            <li>Tap on <strong>Storage</strong> and select <strong>"Clear Storage" / "Clear Data"</strong>. This instantly eliminates all locally cached preferences.</li>
                            <li>Proceed to choose <strong>Uninstall</strong> to completely purge the underlying binary files and configurations from your mobile device.</li>
                        </ol>
                    </div>
                </section>

                <section>
                    <h2><div className="section-num">5</div>Children's Privacy Protection (COPPA Compliance)</h2>
                    <p>IslahBD is engineered as a spiritual and lifestyle utility tailored for general audiences. However, to stay fully aligned with the strict child protection guidelines of global frameworks and the <strong>Google Play Families Policy</strong>, we enforce clear boundaries:</p>
                    <p>The App is intentionally designated and targeted for use by individuals <strong>aged 16 and older</strong>. We do not knowingly solicit or collect data from children under the age of 13. In the event that a child under 13 activates the app, no personal data can be harvested due to our fundamental zero-data-collection infrastructure. If you suspect that local device configurations contain variables you wish to remove, simply execute the data erasure steps listed in Section 4.</p>
                </section>

                <section>
                    <h2><div className="section-num">6</div>Updates to This Privacy Policy</h2>
                    <p>We may update this legal document from time to time to accommodate evolving software optimizations, feature sets, or updates to the Google Play Developer Distribution Agreement. Any changes will be marked by an updated "Effective Date" at the top of this page. We highly recommend that our user community inspect this link periodically to stay continuously informed about our absolute data isolation models.</p>
                </section>

                <section>
                    <h2><div className="section-num">7</div>Regulatory Compliance Contact Information</h2>
                    <p>For any clarifying technical questions regarding the software sandboxing process, sensor computation logic, or to confirm policy validation details during Google Play store inspection cycles, please contact our core oversight desk:</p>
                    
                    <div className="info-card" style={{ marginTop: '20px', lineHeight: 1.9 }}>
                        <strong>Muhmmad Tayeb Ashraf // Legal and Compliance Operations</strong><br />
                        Dedicated Legal Inquiries Email: <a href="mailto:tayebashraf1973@gmail.com">tayebashraf1973@gmail.com</a><br />
                        Primary Application Scope: Bangladesh Geographic Market Compliance
                    </div>
                </section>

                <footer>
                    &copy; 2026 Muhmmad Tayeb Ashraf. All Rights Reserved.<br />
                    Protected Under End-to-End Local Client-Side Sandbox Execution Architecture.
                </footer>
            </div>
        </div>
    );
}
