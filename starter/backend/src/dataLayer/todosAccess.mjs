import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { generateUUID } from '../businessLogic/todos.mjs'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION
})

const documentClient = DynamoDBDocument.from(client)

export const getTodos = async (userId) => {
  const params = {
    TableName: process.env.TODOS_TABLE,
    IndexName: 'CreatedAtIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }
  const listData = await documentClient.query(params)

  return listData.Items
}

export const createTodo = async (payload, userId) => { 
  const { name, dueDate } = payload
  const uuid = generateUUID()
  const item = {
    userId,
    todoId: uuid,
    name,
    dueDate,
    attachmentUrl: `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${uuid}`,
    done: false,
    createdAt: new Date().toISOString()
  }

  var params = {
    TableName: process.env.TODOS_TABLE,
    Item: item
  }

  await documentClient.put(params)
  return item
}

export const getTodo = async (userId, todoId) => {
  var params = {
    TableName : process.env.TODOS_TABLE,
    Key: {      
      userId,
      todoId,
    }
  };
  
  const res = await documentClient.get(params)
  return res.Item
}

export const updateTodo = async (payload) => {
  const {done, userId, name, todoId, dueDate} = payload;
  const existingItem = await getTodo(userId, todoId)

  const item = {
    ...existingItem,
    name,
    dueDate,
    done
  }

  var params = {
    TableName: process.env.TODOS_TABLE,
    Item: item
  }

  await documentClient.put(params)
}

export const deleteTodo = async (userId, todoId) => {
    var params = {
      TableName : process.env.TODOS_TABLE,
      Key: {
        userId,
        todoId,
      }
    };
    
    await documentClient.delete(params)
  }