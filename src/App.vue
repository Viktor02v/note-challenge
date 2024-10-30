<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const editorContent = ref('');
const timeout = ref(null);
const editor = ref();


const clearContent = () => {
	editor.value.setHTML('');
}

const saveEditorContent = () => {
	clearTimeout(timeout.value);
	timeout.value = setTimeout(() => {
		localStorage.setItem('editorContent', JSON.stringify(editorContent.value));
	}, 2000);
};

onMounted(() => {
	const savedContent = localStorage.getItem('editorContent');
	if (savedContent) {
		editorContent.value = JSON.parse(savedContent);
	};
});
</script>

<template>
	<div class="w-full h-full container py-20 flex gap-10 ">
		<div class="w-full flex flex-col h-full">
			<div class="mb-5 w-full">
				<button @click="clearContent" class="p-2 rounded-md w-full bg-gray-400  text-white">
					Clear Content
				</button>

			</div>
			<QuillEditor @update:content="saveEditorContent" v-model:content="editorContent" content-type="html"
				theme="snow" ref="editor" />
		</div>
		<div class="flex w-full items-center flex-col gap-5">
			<h2 class="text-2xl font-bold">Preview</h2>
			<div>
				<div v-html="editorContent">
				</div>
			</div>
		</div>
	</div>
</template>
