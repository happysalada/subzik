<script lang="ts">
	import AtomicLoader from "$lib/AtomicLoader.svelte";
	import type { PageData } from "./$types";
	import type { Medium } from "$lib/globals.d.ts";
	import { FormState } from "$lib/globals.d.ts";
	import { user } from "$lib/stores";
	import { goto } from "$app/navigation";

	let error: undefined | string;
	let state = FormState.Ready;

	let files: FileList;
	export let data: PageData;

	console.log(data);

	async function submitForm(event: Event) {
		event.preventDefault();
		state = FormState.Submitted;
		const dataArray = new FormData();
		dataArray.append("file", files[0]);
		try {
			let response = await fetch(
				`https://summary.sassy.technology/${$user.email}/transcribe_and_summarize`,
				{
					method: "POST",
					body: dataArray,
				}
			);

			if (response.status == 200) {
				state = FormState.Success;
			}
		} catch (e) {
			state = FormState.Error;
			error = e.toString();
		}
	}

	if (!$user) {
		goto("/");
	}

	function mediumState({
		summary,
		transcription,
		upload_url,
	}: Medium): string {
		if (upload_url) {
			if (transcription) {
				if (summary) {
					return "Summarized";
				} else {
					return "Transcribed";
				}
			} else {
				return "Uploaded";
			}
		} else {
			return "Submitted";
		}
	}
</script>

<div class="px-4 sm:px-6 lg:px-8 relative z-10">
	<div class="sm:flex sm:items-center my-10">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Uploaded songs</h1>
			<p class="mt-2 text-sm text-gray-700">
				Here is a list of all the uploaded songs you have
			</p>
		</div>
	</div>

	{#if state == FormState.Error}
		<div class="rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<!-- Heroicon name: mini/x-circle -->
					<svg
						class="h-5 w-5 text-red-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">
						There were errors with your submission
					</h3>
					<div class="mt-2 text-sm text-red-700">
						<ul class="list-disc space-y-1 pl-5">
							<li>{error}</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<form class="space-y-8 divide-y divide-gray-200 my-10" on:submit={submitForm}>
		<div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
			<div class="sm:col-span-1" />
			<div class="mt-1 sm:col-span-1 sm:mt-0">
				{#if state == FormState.Submitted}
					<div class="w-full flex justify-center">
						<AtomicLoader />
					</div>
				{:else if state == FormState.Uploaded}
					<div class="text-center">
						<p> Your file has been uploaded for processing, it should take about 5 mins </p>
					</div>
				{:else if files && files[0]}
					<div class="text-center">
						<p>uploaded: {files[0].name}</p>
						<button
							type="submit"
							class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
						>
							Upload
						</button>
					</div>
				{:else}
					<div
						class="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
					>
						<div class="space-y-1 text-center">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
								aria-hidden="true"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<div class="flex text-sm text-gray-600">
								<label
									for="file-upload"
									class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
								>
									<span>Upload a file</span>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										class="sr-only"
										bind:files
									/>
								</label>
								<p class="pl-1">or drag and drop</p>
							</div>
							<p class="text-xs text-gray-500">MP3, WAV, FLAC... up to 1GB</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</form>

	<div class="mt-8 flex flex-col">
		<div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				<div
					class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
				>
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
									>Name</th
								>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>Length</th
								>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">View</span>
								</th>
							</tr>
						</thead>
						<tbody class="bg-white">
							<!-- Odd row -->
							{#each [{id: 'something', name: "first song", length: "1.59"}] as medium}
								<tr>
									<td
										class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
										>{medium.name}</td
									>
									<td
										class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										>{medium.length}</td
									>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<a href="/medium/{medium.id}" class="text-indigo-600 hover:text-indigo-900"
											>View<span class="sr-only">, {medium.name}</span></a
										>
									</td>
								</tr>
							{/each}

							<!-- More people... -->
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
