<script setup lang="ts">
// Components
import CommentComponent from '@/components/CommentComponent.vue';

// Pinia
import { useEditorStore } from '@/stores/editorStore';
const editorStore = useEditorStore()
</script>

<template>
	<div v-for="comment in editorStore.comments" :key="comment.id" class="w-full min-h-[10vh] flex flex-col">
		<CommentComponent :comment="comment" />
	</div>
</template>
