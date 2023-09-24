# RabbitMQ Message Consumer in Node.js with TypeScript

### Purpose of the Project:

The purpose of this project is to demonstrate how to build a message consumer using Node.js and TypeScript that connects to a message broker called RabbitMQ. Let's break down what this means:

Node.js: Node.js is a runtime environment for running JavaScript code on a server or computer. It's commonly used for building web applications and services.

TypeScript: TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors early in the development process and makes code more maintainable.

Message Consumer: In this context, a message consumer is a program that listens for and processes messages sent by other programs. It's like a mailbox that waits for letters to arrive.

RabbitMQ: RabbitMQ is a message broker. It's a piece of software that helps different parts of an application communicate by passing messages between them. Think of it as a post office that ensures messages get from one place to another reliably.

### Project Details:

This project consists of two main parts: a producer and a consumer.

Producer: The producer is not part of this project but is assumed to exist. It's responsible for sending messages to RabbitMQ. These messages could be anything: orders from an online store, log data from a website, or sensor readings from an IoT device.

Consumer: The consumer is the focus of this project. It's a program written in TypeScript that connects to RabbitMQ and waits for messages to arrive. When a message arrives, the consumer processes it. In our example, the consumer simply prints the received message to the console. However, in real applications, it could perform more complex tasks like updating a database or triggering other actions.

### How It Works:

The consumer establishes a connection to RabbitMQ, which is running in a Docker container.

It specifies a queue (in this case, 'my-queue') where it expects to receive messages.

The consumer continuously listens for messages on the queue. When a message arrives, it retrieves it and processes it.

In our example, we set a goal to receive 1000 messages. Once it reaches this goal, the consumer exits.

The purpose of this project is to demonstrate a fundamental concept in distributed systems: message-based communication. It helps different parts of a system work together by sending and receiving messages. RabbitMQ is a tool that facilitates this communication.

For beginners, projects like this provide hands-on experience with common technologies used in the software development world. It's a simple example, but the principles can be applied to much larger and more complex systems. As you gain experience, you can build on these concepts to create powerful and scalable applications.
