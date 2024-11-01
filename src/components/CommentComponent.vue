<script setup lang="ts">
import { useEditorStore } from '@/stores/editorStore';
const editorStore = useEditorStore()

const props = defineProps({
	comment: Object
})
</script>

<template>
				<div v-if="props.comment" class="border relative w-full flex flex-col py-10 container rounded-md bg-gray-200 text-white">
					<div  class="absolute p-0.5 bg-white rounded-md text-[0.8rem] px-1 text-black top-[0.5rem] left-[1rem]">
						{{ props.comment.name }}
					</div>
					<div class="absolute p-0.5 bg-white text-[0.8rem] px-1 rounded-md text-black top-[0.5rem] right-[1rem]">
						{{ props.comment.time }}
					</div>
					<div  v-text="props.comment.content" class="text-black block w-full text-[1rem] break-words overflow-hidden">
					</div>
					<button 
						class="absolute bottom-1 right-[1rem] py-0.5 px-1 bg-white border border-gray-300 hover:bg-gray-100 hover:transition-all hover:duration-500 rounded-md text-[0.8rem] text-black"
						type="button" @click="editorStore.deleteComment(props.comment.id)">
						Delete
					</button>
				</div>
				<div v-else> There are no comments.... </div>
</template>



