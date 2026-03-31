/* eslint-disable import/no-unresolved */
import React, { useEffect } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import ThemedImage from "@theme/ThemedImage";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const innersourceText = document.getElementsByClassName("typing-open-source")[0];
    const onScroll = () => {
      if (innersourceText && isInViewport(innersourceText)) {
        innersourceText.classList.add("animate");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  return (
    <Layout title={`${siteConfig.title}`} description="Documentation for SAP Crossplane Providers">
      <div className="lp-home">
        <div className="flex-container">
          <div className="main">
            <h1 className="heading">
              <span className="name clip">Crossplane Provider Docs</span>
              <span className="text">Stop clicking. Start orchestrating.</span>
            </h1>
            <div className="container" style={{ padding: "0" }}>
              <div className="actions">
                <div className="action medium alt">
                  <a href="/crossplane-provider-docs/docs/contribution/understand-providers">Contribution</a>
                </div>
                <div className="action medium alt">
                  <a href="/crossplane-provider-docs/docs/crossplane-provider-btp/docs/user-stories/account/subaccount">crossplane-provider-btp</a>
                </div>
                <div className="action medium alt">
                  <a href="/crossplane-provider-docs/docs/crossplane-provider-hana/docs/user-stories/setup">crossplane-provider-hana</a>
                </div>
              </div>
            </div>
          </div>
          <div className="image">
            <div className="image-container">
              <div className="image-bg"></div>
              <img
                className="image-src"
                src={require("/img/co_axolotl.png").default}
                alt="Crossplane Axolotl"
                style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      <main>
        <section className="features-section" style={{ background: "var(--lp-c-bg-elv)", padding: "48px 24px" }}>
          <div className="container">
            <div className="lp-features">
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Code icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-code.png"),
                    dark: useBaseUrl("/img/icons/icon-code-dark.png"),
                  }}
                />
                <h3>Everything in code</h3>
                <p>Define your entire cloud landscape using code. Always know exactly what's defined and leverage review-based workflows, version control, and much more.</p>
              </div>
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Reconcile icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-reconcile.png"),
                    dark: useBaseUrl("/img/icons/icon-reconcile-dark.png"),
                  }}
                />
                <h3>Continuous self-healing</h3>
                <p>Keep your landscape in sync. Crossplane continuously observes the desired and the actual state and reconciles any differences automatically.</p>
              </div>
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Align icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-align.png"),
                    dark: useBaseUrl("/img/icons/icon-align-dark.png"),
                  }}
                />
                <h3>One syntax for all</h3>
                <p>
                  Use a unified approach to define and manage resources across multiple cloud providers and services, reducing infrastructure complexity significantly.
                </p>
              </div>
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Puzzle icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-puzzle.png"),
                    dark: useBaseUrl("/img/icons/icon-puzzle-dark.png"),
                  }}
                />
                <h3>Designed for reuse</h3>
                <p>
                  Define your landscapes in modular building blocks using <i>Crossplane Compositions</i> or <i>Helm charts</i>. Replicate modules easily across different regions or stages.
                </p>
              </div>
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Platform icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-platform.png"),
                    dark: useBaseUrl("/img/icons/icon-platform-dark.png"),
                  }}
                />
                <h3>Run a platform</h3>
                <p>
                  Prebuild your own platform tailored to the specific needs of your organization and offer it to development teams in a self-service way.
                </p>
              </div>
              <div className="lp-feature-card">
                <ThemedImage
                  alt="Simple icon"
                  sources={{
                    light: useBaseUrl("/img/icons/icon-simple.png"),
                    dark: useBaseUrl("/img/icons/icon-simple-dark.png"),
                  }}
                />
                <h3>Built for everyone</h3>
                <p>
                  Whether you are a cloud expert or just getting started — our providers are designed to help everyone.
                  We run 100% open-source.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="get-started-section gray-white">
          <Link
            className="button button--primary button--lg"
            to="/crossplane-provider-docs/docs/contribution/understand-providers"
          >
            Start contributing
          </Link>
          <span>
            or explore{" "}
            <Link to="/crossplane-provider-docs/docs/crossplane-provider-btp/docs/user-stories/btp">
              our crossplane provider for SAP BTP
            </Link>
          </span>
          <span>
            or explore{" "}
            <Link to="/crossplane-provider-docs/docs/crossplane-provider-hana/docs/user-stories/setup">
              our crossplane provider for SAP HANA
            </Link>
          </span>
        </section>

        <section className="open-source-section">
          <div className={clsx("col col--8")}>
            <div className="text--center padding-horiz--md">
              <div className="open-source-wrapper">
                <div className="typing-open-source">100% open-source</div>
              </div>
              <div className="doc-image-light">
                <img
                  src={require("/img/landingpage-crossplane.png").default}
                  alt="Crossplane based on CNCF"
                  style={{ maxWidth: "100%", marginBottom: "24px" }}
                />
              </div>
              <p>
                Through technical <b>providers</b>, we request, update and delete the cloud resources we want to
                orchestrate. They <b>allow us to describe environments in code</b>. Most SAP cloud services do not
                offer providers and are therefore not orchestrable yet. Since their APIs are public, we can build those
                ourselves.
                <br />
                <br />
                We truly believe in open standards — our solutions are based on the{" "}
                <b>
                  open-source project <Link to="https://crossplane.io/">Crossplane</Link>
                </b>
                . Crossplane is recommended by the{" "}
                <b>
                  Cloud Native Computing Foundation <Link to="https://www.cncf.io/projects/crossplane/">(CNCF)</Link>
                </b>
                .
                <br />
                <br />
                <b>
                  We believe that no single team can achieve a fully orchestrated environment by writing providers on
                  their own.
                  <br /> Only through collaboration we can make SAP's cloud services 100% orchestratable for everyone.
                </b>
                <br />
                <br />
              </p>
              <Link
                className="button button--primary button--lg"
                to="https://github.com/SAP?q=crossplane&type=all"
              >
                💪 See our projects
              </Link>
              <br />
              <span>
                and learn <Link to="/crossplane-provider-docs/docs/contribution/understand-providers">how to contribute</Link>
              </span>
              <br />
              <br />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}