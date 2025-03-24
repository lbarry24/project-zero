class LinkPreviewCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiUrl = "https://open-apis.hax.cloud/api/services/website/metadata?q=";
        this.state = {
            loading: true,
            error: false,
            metadata: null,
        };
    }

    static get observedAttributes() {
        return ["href"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "href" && newValue) {
            this.fetchMetadata(newValue);
        }
    }

    async fetchMetadata(url) {
        this.state.loading = true;
        this.update();

        try {
            const response = await fetch(`${this.apiUrl}${encodeURIComponent(url)}`);
            const json = await response.json();
            if (json.status === 200 && json.data) {
                this.state.metadata = json.data;
                this.state.error = false;
            } else {
                this.state.error = true;
            }
        } catch (error) {
            this.state.error = true;
        }

        this.state.loading = false;
        this.update();
    }

    getThemeColor(url) {
        if (url.includes("psu.edu")) return "var(--psu-theme)";
        return "var(--default-theme)";
    }

    update() {
        const { loading, error, metadata } = this.state;
        const themeColor = metadata?.["theme-color"] || this.getThemeColor(this.getAttribute("href"));

        this.shadowRoot.innerHTML = `
            <style>
                @import url('style.css');
                .card { border-left-color: ${themeColor}; }
                .title { color: ${themeColor}; }
            </style>
            ${loading ? `<div class="loading">Loading...</div>` : ""}
            ${error ? `<div class="loading">No preview available</div>` : ""}
            ${metadata ? `
                <div class="card">
                    ${metadata["og:image"] ? `<img class="image" src="${metadata["og:image"]}" alt="Preview">` : ""}
                    <div class="content">
                        <div class="title">${metadata["og:title"] || "No Title"}</div>
                        <div class="description">${metadata["og:description"] || "No description available."}</div>
                        <a class="link" href="${metadata.url}" target="_blank">${metadata.url}</a>
                    </div>
                </div>
            ` : ""}
        `;
    }

    connectedCallback() {
        const url = this.getAttribute("href");
        if (url) this.fetchMetadata(url);
    }
}

customElements.define("link-preview-card", LinkPreviewCard);

