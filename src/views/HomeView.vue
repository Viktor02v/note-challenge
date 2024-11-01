<script setup lang="ts">
import { watch } from 'vue';


// Components
import CommentsList from '@/components/CommentsList.vue';
// Editor
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Pinia
import { useEditorStore } from '@/stores/editorStore';
const editorStore = useEditorStore()


watch(editorStore.comments, editorStore.saveComments, { deep: true });

</script>

<template>
	<div class="w-full h-full md:flex container py-20 gap-10">
		<div class="w-full md:w-[40vw] h-full mb-10 md:mb-0 flex flex-col">
			<div class="flex mb-5 w-[20vw] md:w-[10vw] gap-3 flex-col">
				<label for="name">Nick Name</label>
				<input class="p-2 rounded-md border text-[0.8rem]" @input="editorStore.userInfo" name="name" type="text" />
			</div>
			<QuillEditor class="w-full h-[10rem] overflow-hidden" @update:content="editorStore.saveEditorContent"
				v-model:content="editorStore.editorContent" content-type="text" theme="snow" ref="editor" />
			<div class="mt-5 gap-10 flex w-full">
				<button @click="editorStore.clearContent"
					class="p-2 rounded-md hover:bg-gray-400 hover:transition-all hover:duration-200 w-full bg-gray-300 text-white">
					Clear Content
				</button>
				<button @click="editorStore.addComment"
					class="p-2 rounded-md hover:bg-gray-400 hover:transition-all hover:duration-200 w-full bg-gray-300 text-white">
					Add Comment
				</button>
			</div>
		</div>
		<div class="flex w-full md:w-[40vw] items-center flex-col gap-5">
			<h2 class="text-2xl font-bold">Preview</h2>
			<CommentsList />
		</div>
	</div>
</template>

