import { MongoClient } from 'mongodb'

interface Config {
  url: string
}

class InitMongo {
  private client: MongoClient
  private collection
  private config: Config

  constructor(config: Config) {
    this.client = MongoClient
    this.config = config
  }

  private caller(collectionName: string, callee: Function) {
    return new Promise((resolve, reject) => {
      this.client.connect(this.config.url, (err, db) => {
        if (err) {
          return reject(err)
        }

        this.collection = db.collection(collectionName)

        return callee()
          .then((data) => {
            db.close()
            resolve(data)
          })
          .catch(console.error)
      })
    })
  }

  /**
   * Insert
   */
  private insertCallee(elements: object[] | object) {
    return new Promise((resolve, reject) => {
      this.collection.insertMany(elements, (error, result) => {
        if (error) {
          return reject(error)
        }

        return resolve(result)
      })
    })
  }

  public insert(collectionName: string, elements: object[] | object) {
    if (elements.constructor !== Array) {
      elements = [elements]
    }

    return this.caller(collectionName, () => this.insertCallee(elements))
  }

  /**
   * Find
   */
  private findCallee(query: object) {
    return new Promise((resolve, reject) => {
      this.collection.find(query).toArray((error, result) => {
        if (error) {
          return reject(error)
        }

        return resolve(result)
      });
    })
  }

  public find(collectionName: string, query: object) {
    return this.caller(collectionName, () => this.findCallee(query))
  }

  /**
   * Delete
   */
  private deleteCallee(elements: any) {
    return new Promise((resolve, reject) => {
      const element = elements[0]

      this.collection.deleteOne({ id: element.id }, (error, result) => {
        if (error) {
          return reject(error)
        }

        return resolve(result)
      })
    })
  }

  public delete(collectionName: string, elements: object[] | object) {
    if (elements.constructor !== Array) {
      elements = [elements]
    }

    return this.caller(collectionName, () => this.deleteCallee(elements))
  }

  /**
   * Update
   */
  private updateCallee(element: any) {
    return new Promise((resolve, reject) => {
      this.collection.update({ id: element.id }, element, (error, result) => {
        if (error) {
          return reject(error)
        }

        return resolve(result)
      })
    })
  }

  public update(collectionName: string, element: object) {
    return this.caller(collectionName, () => this.updateCallee(element))
  }
}

export default InitMongo
