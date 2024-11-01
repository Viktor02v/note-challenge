<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// QuillEditor
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// States for the QuillEditor
const editorContent = ref((JSON.parse(localStorage.getItem('editorContent') || '')));
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
	if (editorContent.value.length < 5) {
		alert('You need to type something in')
		return
	} else if (!userName.value) {
		alert('You need to type your Nick Name')
		return
	} else {
		const comment = {
			id: nextId,
			name: userName.value,
			content: editorContent.value,
		}
		comments.value.push(comment);
		nextId++;
	}
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
	const savedContent = JSON.parse(localStorage.getItem('editorContent'));
	if (savedContent) {
		editorContent.value = savedContent;
	};
	const savedComments = JSON.parse(localStorage.getItem('comments'));
	if (savedComments) {
		comments.value = savedComments;
	}
});

console.log(editorContent.value.length)
</script>

<template>
	<div class="w-full h-full md:flex container py-20 gap-10 ">

		<!-- Editor Content -->
		<div class="w-full md:w-[40vw] h-full mb-10 md:mb-0 flex flex-col ">

			<div class="flex mb-5 w-[20vw] md:w-[10vw] gap-3 flex-col">
				<label for="name">Nick Name</label>
				<input class="p-2 rounded-md border " @input="userInfo" name="name" type="text">
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

		<!-- Preview Section -->
		<div class="flex w-[90vw] items-center flex-col gap-5">
			<h2 class="text-2xl font-bold">Preview</h2>

			<div v-for="comment in comments" :key="comment.id" class="w-full min-h-[10vh]  flex flex-col">
				<!-- Comment in Comments -->
				<div class="border relative py-10 w-full container rounded-md bg-gray-200 text-white">
					<div class="absolute p-0.5 bg-white rounded-md text-black top-[0.5rem] left-[1rem]">{{ comment.name }}</div>
					<div v-text="comment.content" class="text-black w-full text-[1.25rem]"></div>
					<button class="absolute bottom-1 right-[1rem] p-0.5 bg-white rounded-md text-black" type="button" @click="deleteComment(comment.id)"> Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
