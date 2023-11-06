import { TodoAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
//import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todoAccess = new TodoAccess()

export const getTodosForUser = async (userId: string) => {
    return todoAccess.getTodos(userId)
}

export const createTodo = async (userId: string, todo: CreateTodoRequest) => {
    const todoId = uuid.v4()
    logger.info(`Creating todo ${todoId}`)
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    return todoAccess.createTodo({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl,
        ...todo
    })
}

export const updateTodo = async (
    userId: string,
    todoId: string,
    todo: UpdateTodoRequest
) => {
    return todoAccess.updateTodo(userId, todoId, todo)
}

export const deleteTodo = async (userId: string, todoId: string) => {
    return todoAccess.deleteTodo(userId, todoId)
}