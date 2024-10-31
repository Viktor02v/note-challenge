<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// QuillEditor
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { WatchDirectoryFlags } from 'typescript';

// States for the QuillEditor
const editorContent = ref('');
const timeout = ref(null);
const editor = ref();


// States for the Preview
const comments = ref(JSON.parse(localStorage.getItem('comments') || '[]'));
let nextId = 1;

const userName = ref('');

const userInfo = (event) => {
	userName.value = event.target.value;
};

// Add Comment
const addComment = () => {
	const comment = {
		id: nextId,
		name: userName.value,
		content: editorContent.value,
	}
	comments.value.push(comment);
	nextId++;
	console.log(comments.value);
};

const deleteComment = (id) => {
	const index = comments.value.findIndex(comment => comment.id === id);
	if (index !== -1) {
		comments.value.splice(index, 1);
	};
};



// Clear the content of the Editor
const clearContent = () => {
	editor.value.setHTML('');
};

// Save the content of the Editor in the LocalSrtorage
const saveEditorContent = () => {
	clearTimeout(timeout.value);
	if (timeout.value === undefined) {
		throw new Error('There has been an error');
	};
	timeout.value = setTimeout(() => {
		localStorage.setItem('editorContent', JSON.stringify(editorContent.value));
	}, 2000);
};

// Save Comments 
const saveComments = () => {
	localStorage.setItem('comments', JSON.stringify(comments.value));
}

watch(comments, saveComments, { deep: true });

// Parse the content of the Editor 
onMounted(() => {
	const savedContent = localStorage.getItem('editorContent');
	if (savedContent) {
		editorContent.value = JSON.parse(savedContent);
	};
	const savedComments = JSON.parse(localStorage.getItem('comments'));
	if (savedComments) {
		comments.value = savedComments;
	}
});
</script>

<template>
	<div class="w-full h-full container py-20 flex gap-10 ">
		<!-- Editor Content -->
		<div class="w-[50vw] flex flex-col h-full">
			<div class="mb-5 gap-10 flex w-full">
				<button @click="clearContent" class="p-2 rounded-md w-full bg-gray-400 text-white">
					Clear Content
				</button>
				<button @click="addComment" class="p-2 rounded-md w-full bg-gray-400 text-white">
					Add Comment
				</button>
			</div>
			<div class="">
				<div class="flex w-[50%] flex-col">
					<label for="name">Name</label>
					<input @input="userInfo" name="name" type="text">
				</div>
				<QuillEditor @update:content="saveEditorContent" v-model:content="editorContent" content-type="html"
					theme="snow" ref="editor" />
			</div>
		</div>

		<!-- Preview Section -->
		<div class="flex w-full items-center flex-col gap-5">
			<h2 class="text-2xl font-bold">Preview</h2>
			<!-- Comment Section -->
			<div id="comment" class="w-full">
				<div v-for="comment in comments" :key="comment.id" class="">
					<!-- Comment in Comments -->
					<div class="border flex items-center w-full justify-between container rounded-md bg-gray-200 text-white">

						<div>{{ comment.name }}</div>

						<div v-html="comment.content" class="text-black text-[1.25rem]"></div>

						<button type="button" @click="deleteComment(comment.id)"> Delete </button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
