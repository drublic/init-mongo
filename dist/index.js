"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class InitMongo {
    constructor(config) {
        this.client = mongodb_1.MongoClient;
        this.config = config;
    }
    caller(collectionName, callee) {
        return new Promise((resolve, reject) => {
            this.client.connect(this.config.url, (err, db) => {
                if (err) {
                    return reject(err);
                }
                this.collection = db.collection(collectionName);
                return callee()
                    .then((data) => {
                    db.close();
                    resolve(data);
                })
                    .catch(console.error);
            });
        });
    }
    insertCallee(elements) {
        return new Promise((resolve, reject) => {
            this.collection.insertMany(elements, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
    insert(collectionName, elements) {
        if (elements.constructor !== Array) {
            elements = [elements];
        }
        return this.caller(collectionName, () => this.insertCallee(elements));
    }
    findCallee(query) {
        return new Promise((resolve, reject) => {
            this.collection.find(query).toArray((error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
    find(collectionName, query) {
        return this.caller(collectionName, () => this.findCallee(query));
    }
    deleteCallee(elements) {
        return new Promise((resolve, reject) => {
            const element = elements[0];
            this.collection.deleteOne({ id: element.id }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
    delete(collectionName, elements) {
        if (elements.constructor !== Array) {
            elements = [elements];
        }
        return this.caller(collectionName, () => this.deleteCallee(elements));
    }
    update(collectionName, element) {
        return this
            .caller(collectionName, () => {
            return this.deleteCallee([element])
                .then(() => this.insertCallee([element]));
        });
    }
}
exports.default = InitMongo;
//# sourceMappingURL=index.js.map