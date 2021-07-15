# Sudoo-Dynamo-Builder

[![Continuous Integration](https://github.com/SudoDotDog/Sudoo-Dynamo-Builder/actions/workflows/ci.yml/badge.svg)](https://github.com/SudoDotDog/Sudoo-Dynamo-Builder/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/SudoDotDog/Sudoo-Dynamo-Builder/branch/main/graph/badge.svg)](https://codecov.io/gh/SudoDotDog/Sudoo-Dynamo-Builder)
[![npm version](https://badge.fury.io/js/%40sudoo%2Fdynamo-builder.svg)](https://www.npmjs.com/package/@sudoo/dynamo-builder)
[![downloads](https://img.shields.io/npm/dm/@sudoo/dynamo-builder.svg)](https://www.npmjs.com/package/@sudoo/dynamo-builder)

DynamoDB query builder for Node 

## Install

```sh
yarn add @sudoo/dynamo-builder
# Or
npm install @sudoo/dynamo-builder --save
```

## Update Expression Building

```ts
import * as AWS from "aws-sdk";
import { DynamoBuilder } from "@sudoo/dynamo-builder";

const updateInput = DynamoBuilder
    .create('tableName')
    .update()
    .where('key', 'value')
    .update('key1', 'value')
    .update('key2', 'value')
    .update('key3', 'value')
    .build();

(new AWS.DynamoDB.DocumentClient()).update(updateInput, (err, data) => {
    // Handle Response
});
```
