import fixture from 'can-fixture'
import Shop from '../shop'

const store = fixture.store([{
  "_id": "5ab295506c0f760014da6661",
  "product": "Some Switch Game",
  "category": "Gaming",
  "price": 59.95,
  "short": "A game you can play on the switch!",
  "description": "<h2><strong>This Game will be killer awesome!</strong></h2><p>You should buy this game ASAP!</p><p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"This Game will be killer awesome!\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"You should buy this game ASAP!\\n\\n\\n\"}]}",
  "content": "Switch Game",
  "sku": "SW-98456",
  "brand": "Switch",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:56:58.221Z",
  "createdAt": "2018-03-21T17:24:32.848Z"
}, {
  "_id": "5aa5cab49a822cbc1d5c8e40",
  "product": "Shilded HDMI Cable",
  "category": "Cables",
  "price": 15.95,
  "short": "A shilded HDMI cable for home and computer use.",
  "description": "<p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"\\n\\n\"}]}",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:08.233Z",
  "createdAt": "2018-03-12T00:32:52.532Z"
}, {
  "_id": "5aa461d76159311f4a2c7c71",
  "product": "Raspberry Pi",
  "category": "Computers",
  "price": 59.99,
  "short": "A small computer with an ARM processor.",
  "description": "<h2>Some Description</h2><blockquote>Nothing better than a good Pi</blockquote><p>This pi has a lot of cool things...</p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"Some Description\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"Nothing better than a good Pi\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"},{\"insert\":\"This pi has a lot of cool things...\\n\\n\"}]}",
  "content": "Watch",
  "sku": "RA-04552VX",
  "brand": "Rado",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:19.337Z",
  "createdAt": "2018-03-10T22:53:11.701Z"
}, {
  "_id": "5aa5cb339a822cbc1d5c8e41",
  "product": "Peppa Pig Season 1 DVDs",
  "category": "TV & Movies",
  "price": 44.95,
  "short": "Peppa Pig's Adventure Season 1 DVDs.",
  "description": "<p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"\\n\\n\"}]}",
  "content": "",
  "sku": "",
  "brand": "",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:02.035Z",
  "createdAt": "2018-03-12T00:34:59.078Z"
}, {
  "_id": "5aa49da9ecd0205010c0b9fb",
  "product": "PS2 Best Gaming System",
  "category": "Gaming",
  "price": 699.95,
  "short": "One of the worst gaming systems around.",
  "description": "<p><br></p><p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"\\n\\n\\n\"}]}",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:15.062Z",
  "createdAt": "2018-03-11T03:08:25.659Z"
}, {
  "_id": "5a9ef693cddae93eb18da85f",
  "product": "Nintendo Switch",
  "category": "Gaming",
  "price": 499.99,
  "short": "Nintendo gaming system. Handheld or connect to your TV.",
  "description": "<p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"\\n\\n\"}]}",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:22.531Z",
  "createdAt": "2018-03-06T20:14:11.859Z"
}, {
  "_id": "5aa55b4d0ad5c3a73e51626f",
  "product": "Daniel Tiger DVDs",
  "category": "TV & Movies",
  "price": 12.95,
  "short": "DVDs of the kids show.",
  "description": "<p><br></p><p><br></p>",
  "delta": "{\"ops\":[{\"insert\":\"\\n\\n\"}]}",
  "tags": [],
  "imageData": [],
  "listed": true,
  "updatedAt": "2018-03-26T14:57:11.876Z",
  "createdAt": "2018-03-11T16:37:33.474Z"
}], Shop.connection.algebra)

fixture('/shop/{id}', store)

export default store