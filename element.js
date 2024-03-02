// ************************************************************************
/*
    <range-slider min="0" max="100" lower="20" upper="80" color="green" nolabel></range-slider>
   
    */
customElements.define("range-slider", class extends HTMLElement {
    // ====================================================================
    constructor() {
        const createElement = (tag, props = {}) => Object.assign(document.createElement(tag), props);
        // ----------------------------------------------------------------
        const drag = (dragevent) => {
            dragevent.preventDefault();
            const slider = dragevent.target.part; // lower or upper
            const start = this[slider];
            const move = (moveevent) => {
                const offset = (this.max - this.min) * ((moveevent.clientX - dragevent.clientX) / this.offsetWidth);
                if (slider == "lower") {
                    this[slider] = Math.min(Math.max(start + offset, this.min), this.upper);
                } else {
                    this[slider] = Math.max(Math.min(start + offset, this.max), this.lower);
                }
                this.render();
            };
            const up = () => {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        }
        // ----------------------------------------------------------------
        super().attachShadow({ mode: "open" }).append(
            createElement("style", {
                innerHTML:
                    `:host{display:inline-block;position:relative;width:100%}` +
                    `:host{--color:#007bff;height:50px;--size:1.5em;--top:1em}` +
                    // slider buttons
                    `button{position:absolute;display:block;cursor:pointer;border:none;padding:0}` +
                    `button{width:calc(var(--size));height:calc(var(--size));top:calc(var(--top));background:var(--color);border-radius:50%}` +
                    // track and range
                    `[part="track"],[part="range"]{height:8px;top:20px;width:100%;position:absolute}` +
                    `[part="track"]{background:#ddd;width:100%}` +
                    `[part="range"]{background:var(--color);pointer-events:none;text-align:center}` +
                    // label
                    `:host([nolabel]) label{display:none}` +
                    `label{line-height:8px;font-size:10px;font-family:arial}` +
                    `label{background:lightgrey;color:black}`
            }),
            createElement("div", { part: "track" }),
            this.rangeElement = createElement("span", { part: "range", innerHTML: "<label part=label ></label>" }),
            this.lowerElement = createElement("button", {
                part: "lower",
                onmousedown: drag
            }),
            this.upperElement = createElement("button", {
                part: "upper",
                style: "right:0;",
                onmousedown: drag
            })
        );// append
    }// constructor
    // ====================================================================
    connectedCallback() {
        setTimeout(() => {
            if (this.hasAttribute("color")) this.style.setProperty("--color", this.getAttribute("color"));
            this.min = parseInt(this.getAttribute("min") || "0");
            this.max = parseInt(this.getAttribute("max") || "100");
            this.lower = parseInt(this.getAttribute("lower") || this.min);
            this.upper = parseInt(this.getAttribute("upper") || this.max);
            // ----------------------------------------------------------------
            this.render();
        });
    }
    // ====================================================================
    render() {
        const lowerPercentage = ((this.lower - this.min) / (this.max - this.min)) * 100;
        const upperPercentage = ((this.upper - this.min) / (this.max - this.min)) * 100;
        this.lowerElement.style.left = `calc(${lowerPercentage}% - 10px)`;
        this.upperElement.style.right = `calc(${100 - upperPercentage}% - 10px)`;
        this.rangeElement.style.left = `${lowerPercentage}%`;
        this.rangeElement.style.width = `${upperPercentage - lowerPercentage}%`;
        // ----------------------------------------------------------------
        this.label(lowerPercentage, upperPercentage);
    }
    // ====================================================================
    label(from, to) {
        this.rangeElement.querySelector("label").innerHTML = `&nbsp;${~~from}% ${~~to}%&nbsp;`;
    }
});