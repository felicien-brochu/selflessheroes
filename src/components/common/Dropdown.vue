<template>
<div class="dropdown"
  @click.stop="toggleDropdownOptions"
  :class="{ expanded: isExpanded }"
  :style="computedStyles">
  <div class="dropdown-label-container">
    <div class="dropdown-label">
      <span class="text">{{ (config && config.prefix ? config.prefix + " " : "")
          }}{{ config && config.placeholder ? config.placeholder : placeholder }}</span>
      <i class="angle-down"
        :class="{ toggled: isExpanded }"></i>
    </div>
  </div>

  <div v-expand="isExpanded"
    class="options expand">
    <div v-for="option in configOptions"
      class="option"
      @click="setCurrentSelectedOption(option);">{{
				option.value
		}}</div>
  </div>
</div>
</template>
<script>
export default {
  name: "dropdown",
  data() {
    return {
      isBottomSectionToggled: false,
      optionsHeight: 0,
      optionHeight: 35,
      configOptions: [{
          value: "option 1"
        },
        {
          value: "option 2"
        },
        {
          value: "option 3"
        }
      ],
      backgroundColor: "#575d6c",
      backgroundExpandedColor: "#575d6c",
      hoverBackgroundColor: "#568af2",
      isExpanded: false,
      placeholder: "Placeholder",
      textColor: "white",
      borderRadius: "3px",
      border: "none",
      width: 180
    };
  },
  components: {},
  props: ["config"],
  computed: {
    computedStyles: function() {
      return [{
          "--options-height": this.optionsHeight + "px"
        },
        {
          "--options-height-neg": "-" + this.optionsHeight + "px"
        },
        {
          "--option-height": this.optionHeight + "px"
        },
        {
          "--main-el-border-radius": this.borderRadius
        },
        {
          "--dropdown-width": this.width + "px"
        },
        {
          "--dropdown-background-color": this.backgroundColor
        },
        {
          "--dropdown-expanded-color": this.backgroundExpandedColor
        },
        {
          "--dropdown-border": this.border
        },
        {
          "--dropdown-hover-background-color": this.hoverBackgroundColor
        },
        {
          "--dropdown-default-text-color": this.textColor
        }
      ];
    }
  },
  directives: {
    expand: {
      inserted: function(el, binding) {
        if (binding.value !== null) {
          function calcHeight() {
            const currentState = el.getAttribute("aria-expanded");
            el.classList.add("u-no-transition");
            el.removeAttribute("aria-expanded");
            el.style.height = null;
            el.style.height = el.clientHeight + "px";
            el.setAttribute("aria-expanded", currentState);

            setTimeout(function() {
              el.classList.remove("u-no-transition");
            });
          }

          el.classList.add("expand");
          el.setAttribute("aria-expanded", binding.value ? "true" : "false");
          calcHeight();
          window.addEventListener("resize", calcHeight);
        }
      },
      update: function(el, binding) {
        if (el.style.height && binding.value !== null) {
          el.setAttribute("aria-expanded", binding.value ? "true" : "false");
        }
      }
    }
  },
  methods: {
    toggleDropdownOptions() {
      this.isExpanded = !this.isExpanded;
    },
    setCurrentSelectedOption(option) {
      this.$emit("setSelectedOption", option);
    },
    setConfigData() {
      if (this.config) {
        this.configOptions = this.config.options;
        this.width = this.config.width;
        this.placeholder = this.config.placeholder;
        if (this.config.backgroundColor) {
          this.backgroundColor = this.config.backgroundColor;
        }
        if (this.config.backgroundExpandedColor) {
          this.backgroundExpandedColor = this.config.backgroundExpandedColor;
        }
        if (this.config.border) {
          this.border = this.config.border;
        }
        if (this.config.hoverBackgroundColor) {
          this.hoverBackgroundColor = this.config.hoverBackgroundColor;
        }
        if (this.config.textColor) {
          this.textColor = this.config.textColor;
        }
        if (this.config.borderRadius) {
          this.borderRadius = this.config.borderRadius;
        }
      }
    },
    setOptionsHeight() {
      this.optionsHeight = this.optionHeight * this.configOptions.length;
    },
    documentClicked() {
      if (this.isExpanded) {
        this.isExpanded = false
      }
    }
  },
  created() {
    document.addEventListener('click', this.documentClicked);
    this.setConfigData();
    this.setOptionsHeight();
  },
  beforeUdate() {
    // this.setOptionsHeight();
  },
  destroyed() {
    document.removeEventListener('click', this.documentClicked);
  }
};
</script>

<style lang="scss" scoped>
$default-text-hover-color: #fff;
$default-hover-color: #4a4f5d;
$default-text-color: #fff;
$option-padding: 4px 10px;

.dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    width: var(--dropdown-width);
    position: relative;
    border: none;
    border-radius: var(--main-el-border-radius);
    cursor: pointer;
    color: var(--dropdown-default-text-color);
    background: var(--dropdown-background-color);
    user-select: none;
    transition: all 0.15s linear;
    .dropdown-label-container {
        display: flex;
        width: 100%;
        box-shadow: inset 0 0 10px 3px rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.2);
        .dropdown-label {
            display: flex;
            justify-content: space-between;
            flex: 1 1 auto;
            align-items: center;
            height: var(--option-height);
            padding: $option-padding;
            .text {
                font-family: "Roboto", "Noto", Arial, sans-serif;
                font-size: 24px;
            }
            .angle-down {
                display: flex;
                justify-content: center;
                align-items: center;
                border: solid $default-text-color;
                background: transparent;
                border-width: 0 2px 2px 0;
                padding: 4px;
                width: 1px;
                height: 1px;
                margin: -3px 5px 0 0;
                border-color: var(--dropdown-default-text-color);
                transform: rotate(45deg);
                transition: all 0.15s;
            }
            .toggled {
                margin-bottom: -12px;
                transform: rotate(-135deg);
                transition: all 0.15s;
            }
        }
    }

    .options {
        width: 100%;
        .option {
            display: flex;
            align-items: center;
            padding: $option-padding;
            height: 35px;
            font-family: "Roboto", "Noto", Arial, sans-serif;
            font-size: 18px;
        }
        .option:hover {
            color: $default-text-hover-color;
            background: $default-hover-color;
            transition: all 0.15s;
        }
        .option:last-child {
            border-radius: 0 0 var(--main-el-border-radius) var(--main-el-border-radius);
        }
        .option:last-child:hover {
            border-radius: 0 0 var(--main-el-border-radius) var(--main-el-border-radius);
        }
    }
}
.dropdown.expanded {
    background: var(--dropdown-expanded-color);
    border: var(--dropdown-border);
    transition: all 0.15s linear;
    box-shadow: inset 0 0 10px 3px rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.2);
    .dropdown-label-container {
        box-shadow: none;
    }
}

// Expand Class - Most important part
.expand {
    overflow: hidden;
    transition-property: height;
    transition-duration: 0.2s; // Durations can be changed without touching JS
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); // Timing functions also!

    &[aria-expanded="false"] {
        height: 0 !important;
        transition-timing-function: cubic-bezier(0.6, -0.28, 0.735, 0.045); // Timing function can be different for each direction
    }
}

// Smartphones - Landscape + Portrait
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {}
</style>
