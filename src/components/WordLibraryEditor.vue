<template>
    <Transition name="modal">
        <div v-if="isVisible" class="modal-overlay" @click.self="closeEditor">
            <div class="editor-container">
                <h2>编辑词库</h2>
                <textarea v-model="wordLibraryContent" placeholder="每行一个词语"></textarea>
                <div class="button-group">
                    <button class="save-button" @click="saveLibrary">保存</button>
                    <button class="close-button" @click="closeEditor">关闭</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
    name: 'WordLibraryEditor',
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:isVisible', 'close'],
    setup(props, { emit }) {
        const wordLibraryContent = ref('')

        onMounted(async () => {
            wordLibraryContent.value = await window.electron.ipcRenderer.invoke('get-word-library')
        })

        const saveLibrary = () => {
            window.electron.ipcRenderer.send('save-word-library', wordLibraryContent.value)
            closeEditor()
        }

        const closeEditor = () => {
            emit('update:isVisible', false)
            emit('close')
        }

        watch(() => props.isVisible, async (newVal) => {
            if (newVal) {
                wordLibraryContent.value = await window.electron.ipcRenderer.invoke('get-word-library')
            } 
        })

        return {
            wordLibraryContent,
            saveLibrary,
            closeEditor
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.editor-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 90%;
    max-height: 90vh;
}

.editor-container h2 {
    margin: 0 0 1.5rem;
    color: #2c3e50;
    text-align: center;
}

textarea {
    width: 100%;
    height: 300px;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.save-button, .close-button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.save-button {
    background-color: #409EFF;
    color: white;
}

.save-button:hover {
    background-color: #66b1ff;
}

.close-button {
    background-color: #909399;
    color: white;
}

.close-button:hover {
    background-color: #a6a9ad;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>