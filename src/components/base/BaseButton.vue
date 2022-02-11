<script setup lang="ts">
import { computed } from "vue";

  const props = defineProps({
    tag: {
      type: String,
      default: "button",
      validator: (val: string): boolean =>
        ["button", "a", "div", "router-link"].includes(val)
    },
    size: {
      type: String,
      default: "md",
      validator: (val: string): boolean =>
        ["xs", "sm", "md", "lg"].includes(val)
    },
    color: {
      type: String,
      default: "blue",
      validator: (val: string): boolean =>
        [
          "primary",
          "gradient",
          "gradient-reverse",
          "gradient-pink-yellow",
          "gray",
          "red",
          "white",
          "blue",
          "green"
        ].includes(val)
    },
    to: { type: String, default: "" },
    label: { type: String, default: "" },
    block: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    flat: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingLabel: { type: String, default: "loading..." },
    disabled: { type: Boolean, default: false }
  })
    const rootTag = computed(() => {
      return props.to ? "router-link" : props.tag;
    });
    const sizeClasses = computed(() => {
      switch (props.size) {
        case "xs":
          return "px-2 h-6 text-xs";
        case "sm":
          return "px-3 h-9 text-base";
        case "lg":
          return "px-5 h-18 text-lg md:text-2xl";
        default:
          return "px-4 h-12 text-base";
      }
    });
    const circleSizeClasses = computed(() => {
      switch (props.size) {
        case "xs":
          return "w-6 h-6 text-sm";
        case "sm":
          return "w-9 h-9 text-lg";
        case "md":
          return "w-10 h-10 text-lg";
        case "lg":
          return "w-16 h-16 text-2xl";
        default:
          return "w-10 h-10 text-base";
      }
    });
    const bgGradientClasses = computed(() => {
      if (props.outline) return "bg-transparent";
      let fromColor = "blue";
      let toColor = "pink";
      if (props.color === "gradient-reverse") {
        fromColor = "pink";
        toColor = "blue";
      } else if (props.color === "gradient-pink-yellow") {
        fromColor = "pink";
        toColor = "yellow";
      }
      if (props.disabled) {
        return `bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-500`;
      }
      if (props.loading) {
        return propsColor.value;
      }
      return `
        bg-gradient-to-tr from-${fromColor}-500 to-${toColor}-500
        hover:from-${fromColor}-600 hover:to-${toColor}-600
      `;
    });
    const bgFlatClasses = computed(() => {
      return propsColor.value;
    });
    const bgColorClasses = computed(() => {
      if (props.color.includes("gradient")) return bgGradientClasses.value;
      else if (props.outline) return "bg-transparent";
      else if (props.flat) return bgFlatClasses.value;
      else if (props.color === "white") return "bg-white";
      else {
        if (props.disabled) {
          return `bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-500`;
        }
        if (props.loading) {
          return propsColor.value;
        }
        return propsColor.value
      }
    });
    const propsColor = computed(() => {
      switch (props.color) {
          case 'blue':
            return `
            bg-blue-500 hover:bg-blue-600
            dark:bg-blue-dark-500 dark:hover:bg-blue-dark-600
          `;
          case 'green':
            return `
            bg-green-500 hover:bg-green-600
            dark:bg-green-dark-500 dark:hover:bg-green-dark-600
          `;
          case 'red':
            return `
            bg-green-500 hover:bg-green-600
            dark:bg-green-dark-500 dark:hover:bg-green-dark-600
          `;
          case 'red':
            return `
            bg-red-500 hover:bg-red-600
            dark:bg-red-dark-500 dark:hover:bg-red-dark-600
          `;
          case 'gray':
            return `
            bg-gray-500 hover:bg-gray-600
            dark:bg-gray-dark-500 dark:hover:bg-gray-dark-600
          `;
          case 'white':
            return `
            bg-white hover:bg-gray-100
            dark:bg-white-dark dark:hover:bg-white-dark
          `;
          default:
            return `
            bg-blue-500 hover:bg-blue-600
            dark:bg-blue-dark-500 dark:hover:bg-blue-dark-600
          `;

        }
    })
    const borderClasses = computed(() => {
      if (props.outline)
        return propsColor.value;
      return "border-none";
    });
    const textColorClasses = computed(() => {
      if (props.color === "white") {
        if (props.outline) return "text-white";
        else return "text-black";
      }
      if (props.outline || props.flat)
        return propsColor.value;
      return "text-white";
    });
    const displayClasses = computed(() => {
      if (props.circle) return "flex justify-center items-center";
      if (props.block) return "block w-full";
      return "inline-block";
    });
    const shapeClasses = computed(() => {
      if (props.circle || props.rounded) return "rounded-full";
      return "rounded-lg";
    });
    const cursorClasses = computed(() => {
      if (props.disabled || props.loading) return "cursor-not-allowed";
      return "cursor-pointer";
    });
    const shadowClasses = computed(() => {
      if (props.flat || props.disabled || props.loading) return "";
      if (props.size === "sm") return "shadow-sm hover:shadow-none";
      return "shadow hover:shadow-none";
    });
    const btnClasses = computed(() => {
      return {
        [sizeClasses.value]: !props.circle,
        [circleSizeClasses.value]: props.circle,
        [bgColorClasses.value]: true,
        [textColorClasses.value]: true,
        [borderClasses.value]: true,
        [displayClasses.value]: true,
        [shapeClasses.value]: true,
        [shadowClasses.value]: true,
        [cursorClasses.value]: true
      };
    });
    const iconColor = computed(() => {
      if (props.outline) return props.color;
      return "white";
    });

</script>

<template>
  <component
    :is="rootTag"
    v-bind="$attrs"
    :to="to"
    :class="['base-btn overflow-hidden tracking-tight', btnClasses]"
    :disabled="disabled || loading"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <BaseLoadingIcon :size="size" :color="iconColor" />
      <span v-if="loadingLabel" class="ml-2">
        {{ loadingLabel }}
      </span>
    </div>
    <div v-else class="flex justify-center items-center w-full h-full">
      <span v-if="label">
        {{ label }}
      </span>
      <slot v-else />
    </div>
  </component>
</template>

<style scoped>
.base-btn {
  font-variation-settings: "wght" 500;
  transition: all 0.2s ease;
  text-decoration: none !important;
  line-height: 0;
}
.base-btn:focus,
.base-btn:active {
  outline: none !important;
}
</style>
