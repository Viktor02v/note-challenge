<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

type Comment = {
	id: number;
	name: string;
	content: string;
	time: string;
};

const editorContent = ref<string>(localStorage.getItem('editorContent') ? JSON.parse(localStorage.getItem('editorContent') as string) : '');
const timeout = ref<number | null>(null);
const editor = ref<InstanceType<typeof QuillEditor> | null>(null);

const comments = ref<Comment[]>(JSON.parse(localStorage.getItem('comments') || '[]'));
let nextId = 1;
const userName = ref<string>('');

const currentTime = new Date();
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1;
const day = currentTime.getDate();
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();

const userInfo = (event: Event) => {
	userName.value = (event.target as HTMLInputElement).value;
};

const addComment = () => {
	if (editorContent.value.length < 5) {
		alert('You need to type something in');
		return;
	} else if (!userName.value) {
		alert('You need to type your Nick Name');
		return;
	} else {
		const comment: Comment = {
			id: nextId,
			name: userName.value,
			content: editorContent.value,
			time: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
		};
		comments.value.push(comment);
		nextId++;
	}
};

const deleteComment = (id: number): void => {
	const index = comments.value.findIndex(comment => comment.id === id);
	if (index !== -1) {
		comments.value.splice(index, 1);
	}
};

const clearContent = () => {
	editor.value?.setContents([]);
	editorContent.value = '';
};

const saveEditorContent = () => {
	clearTimeout(timeout.value!);
	timeout.value = window.setTimeout(() => {
		localStorage.setItem('editorContent', JSON.stringify(editorContent.value));
	}, 2000);
};

const saveComments = () => {
	localStorage.setItem('comments', JSON.stringify(comments.value));
};

watch(comments, saveComments, { deep: true });

onMounted(() => {
	const savedContent = localStorage.getItem('editorContent');
	if (savedContent) {
		editorContent.value = JSON.parse(savedContent);
	}

	const savedComments = localStorage.getItem('comments');
	if (savedComments) {
		comments.value = JSON.parse(savedComments);
	}
});
</script>

<template>
	<div class="w-full h-full md:flex container py-20 gap-10">
		<div class="w-full md:w-[40vw] h-full mb-10 md:mb-0 flex flex-col">
			<div class="flex mb-5 w-[20vw] md:w-[10vw] gap-3 flex-col">
				<label for="name">Nick Name</label>
				<input class="p-2 rounded-md border text-[0.8rem]" @input="userInfo" name="name" type="text" />
			</div>
			<QuillEditor class="w-full h-[10rem] overflow-hidden" @update:content="saveEditorContent"
				v-model:content="editorContent" content-type="text" theme="snow" ref="editor" />
			<div class="mt-5 gap-10 flex w-full">
				<button @click="clearContent"
					class="p-2 rounded-md hover:bg-gray-400 hover:transition-all hover:duration-200 w-full bg-gray-300 text-white">
					Clear Content
				</button>
				<button @click="addComment"
					class="p-2 rounded-md hover:bg-gray-400 hover:transition-all hover:duration-200 w-full bg-gray-300 text-white">
					Add Comment
				</button>
			</div>
		</div>
		<div class="flex w-full md:w-[40vw] items-center flex-col gap-5">
			<h2 class="text-2xl font-bold">Preview</h2>
			<div v-for="comment in comments" :key="comment.id" class="w-full min-h-[10vh] flex flex-col">
				<div class="border relative w-full flex flex-col py-10 container rounded-md bg-gray-200 text-white">
					<div class="absolute p-0.5 bg-white rounded-md text-[0.8rem] px-1 text-black top-[0.5rem] left-[1rem]">
						{{ comment.name }}
					</div>
					<div class="absolute p-0.5 bg-white text-[0.8rem] px-1 rounded-md text-black top-[0.5rem] right-[1rem]">
						{{ comment.time }}
					</div>
					<div v-text="comment.content" class="text-black block w-full text-[1rem] break-words overflow-hidden">
					</div>
					<button
						class="absolute bottom-1 right-[1rem] py-0.5 px-1 bg-white border border-gray-300 hover:bg-gray-100 hover:transition-all hover:duration-500 rounded-md text-[0.8rem] text-black"
						type="button" @click="deleteComment(comment.id)">
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
