import { ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
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
	
return { userInfo, addComment, deleteComment, clearContent, saveEditorContent, saveComments, comments, editorContent  }
})
