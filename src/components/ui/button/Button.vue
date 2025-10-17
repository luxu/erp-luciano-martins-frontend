<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    v-bind="forwardedAttrs"
    :class="computedClass"
  >
    <slot />
  </Primitive>
</template>

<script setup>
import { computed } from 'vue'
import { useAttrs } from 'vue'
import { Primitive } from 'radix-vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiButton'
})

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  as: {
    type: String,
    default: 'button'
  },
  asChild: {
    type: Boolean,
    default: false
  }
})

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const attrs = useAttrs()

const forwardedAttrs = computed(() => {
  const entries = Object.entries(attrs)
  const result = {}

  for (const [key, value] of entries) {
    if (key !== 'class') {
      result[key] = value
    }
  }

  return result
})

const computedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class)
)
</script>
