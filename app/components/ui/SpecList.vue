<script setup lang="ts">
// Bordered definition/spec table: mono, label (left) / value (right) per row.
// Rendered as a semantic <dl>. Every row carries a hairline top border except
// the first, which reproduces the ".row:first-child { border-top: 0 }" reset.
// Ported from the .specdl block in projects/[slug].vue (kin to home's .spec).
interface SpecRow {
  label: string
  value: string
}

defineProps<{
  rows: SpecRow[]
}>()
</script>

<template>
  <dl class="overflow-hidden rounded-md border border-[color:var(--hair)]">
    <div
      v-for="(row, i) in rows"
      :key="row.label"
      class="grid grid-cols-[9rem_1fr] items-baseline gap-4 px-[1.15rem] py-[.85rem] font-mono text-sm leading-[1.55]"
      :class="{ 'border-t border-[color:var(--hair-soft)]': i > 0 }"
    >
      <dt class="text-micro text-overlay-1 tracking-[.12em] uppercase">
        {{ row.label }}
      </dt>
      <dd class="text-subtext-1">
        {{ row.value }}
      </dd>
    </div>
  </dl>
</template>
