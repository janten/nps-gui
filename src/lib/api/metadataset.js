import {Request} from './request'
import {KeyValueMetadata} from './metadata'

class MetaDataset{
  constructor({dataset_id = "", id="", metadata = []}){
    this.dataset_id = dataset_id
    this.id = id
    this.metadata = metadata
  }

  static getAliases(){
    return (new Request({
        url: '/v2/metadata/aliases',
        method: 'GET'
      }))
      .fetch()
      .then(resp => {
        if(resp.statuscode == 200){
          return resp.json
        }
        return {aliases:{}}
      })
  }

  static getByID(dataset_id, id){
    if(!id){
      // TODO: Exception
    }
    return (new Request({
        url: '/v2/datasets/'+dataset_id+'/meta/'+id,
        method: 'GET'
      }))
      .fetch()
      .then(resp => {
        if(resp.statuscode == 200){
          var meta = []
          Object.keys(resp.json).forEach((key) => {
            meta.push(new KeyValueMetadata(key, resp.json[key]))
          })
          return new MetaDataset({
            dataset_id: dataset_id,
            id: id,
            metadata: meta
          })
        }
      })
  }

  getMetadata(key = null){
    if(key === null){
      return this.metadata
    }
    for(var m of this.metadata){
      if(m.key == key){
        return m
      }
    }
    return null
  }

  save(){
    if(!this.dataset_id){
      // TODO: Exception
    }
    var metadata = {}
    for(var m of this.metadata){
      metadata[m.key] = m.value
    }
    return (new Request({
        url: '/v2/datasets/'+this.dataset_id+'/meta/save',
        method: 'POST',
        data: {
          id: this.id,
          metadata: metadata
        }
      }))
      .fetch()
      .then(resp => {
        if(resp.statuscode == 200){
          this.id = resp.json.id
          var meta = Object.keys(resp.json.metadata).map(
            (val) => new KeyValueMetadata(
              val, resp.json.metadata[val]
            )
          )
          this.metadata = meta
          return this
        }
      })
  }
}

export {MetaDataset}
export default MetaDataset
