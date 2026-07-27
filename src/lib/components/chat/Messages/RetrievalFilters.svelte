<script lang="ts">
	import { getContext } from 'svelte';

	const i18n = getContext('i18n');

	type RetrievalFilter = {
		field?: string;
		operator?: string;
		operands?: unknown[] | unknown;
		source?: string;
		connector?: string | null;
		not_null?: boolean;
	};

	export let filters: RetrievalFilter[] = [];

	let showFilters = false;

	let validFilters: RetrievalFilter[] = [];
	$: validFilters = (filters ?? []).filter((filter) => filter && (filter?.field ?? '') !== '');

	const formatOperands = (operands: unknown[] | unknown) => {
		if (Array.isArray(operands)) {
			return operands.map((operand) => `${operand}`).join(', ');
		}

		return operands === null || operands === undefined ? '' : `${operands}`;
	};
</script>

{#if validFilters.length > 0}
	<div class=" py-1 -mx-0.5 w-full flex gap-1 items-center flex-wrap">
		<button
			class="text-xs font-medium text-gray-600 dark:text-gray-300 px-3.5 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1 border border-gray-50 dark:border-gray-850/30"
			aria-label={validFilters.length === 1
				? $i18n.t('Toggle 1 filter')
				: $i18n.t('Toggle {{COUNT}} filters', { COUNT: validFilters.length })}
			aria-expanded={showFilters}
			on:click={() => {
				showFilters = !showFilters;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="size-3.5 shrink-0"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
					clip-rule="evenodd"
				/>
			</svg>

			<div>
				{#if validFilters.length === 1}
					{$i18n.t('1 Filter')}
				{:else}
					{$i18n.t('{{COUNT}} Filters', {
						COUNT: validFilters.length
					})}
				{/if}
			</div>
		</button>
	</div>
{/if}

{#if showFilters}
	<div class="py-1.5">
		<div class="text-xs gap-2 flex flex-col">
			{#each validFilters as filter, idx}
				<div class="flex items-center gap-1.5 flex-wrap text-gray-600 dark:text-gray-300">
					<div class=" font-medium bg-gray-50 dark:bg-gray-850 rounded-md px-1">
						{idx + 1}
					</div>

					<div class="font-medium dark:text-white/60">
						{filter.field}
					</div>

					{#if filter.operator}
						<div class="text-gray-500 dark:text-gray-400">
							{filter.operator}
						</div>
					{/if}

					{#if formatOperands(filter.operands) !== ''}
						<div class="bg-gray-50 dark:bg-gray-850 rounded-md px-1 truncate">
							{formatOperands(filter.operands)}
						</div>
					{/if}

					{#if filter.not_null}
						<div class="bg-gray-50 dark:bg-gray-850 rounded-md px-1 uppercase">
							{$i18n.t('not null')}
						</div>
					{/if}

					{#if filter.source}
						<div class="text-gray-500 dark:text-gray-400">
							{filter.source === 'config'
								? $i18n.t('from configuration')
								: filter.source === 'prompt'
									? $i18n.t('from prompt')
									: filter.source}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
