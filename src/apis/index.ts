import { Func, Inject, Provide } from '@midwayjs/decorator';
import TableStore from 'tablestore';
import format from 'otswhere/format';
import { SSL_OP_COOKIE_EXCHANGE } from 'constants';

@Provide()
export class TodoService {

  @Inject()
  ctx;

  @Inject()
  tb;

  @Func('blog.list')
  async handler() {
    const params = {
      tableName: 'blog',
      direction: TableStore.Direction.BACKWARD,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MAX }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MIN }]
    };
    return new Promise(resolve => {
      this.tb.getRange(params, (_, data) => {
        const rows = format.rows(data, { email: true });
        resolve(rows);
      });
    })
  }

  @Func('blog.update')
  async update() {
    const { id, content, title, author } = this.ctx.query;
    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { 'id': id },
      ],
      attributeColumns: [
        { content },
        { title },
        { author }
      ]
    };
    return new Promise((resolve) => {
      this.tb.putRow(params, function (err, data) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  @Func('blog.del')
  async remove() {
    const { id } = this.ctx.query;
    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id }]
    };
    return new Promise(resolve => {
      this.tb.deleteRow(params, function (err, data) {
        if (err) {
          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });
  }

  @Func('blog.new')
  async add() {
    const { content, title, author } = this.ctx.query;

    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { id: `${Date.now()}-${Math.random()}` }
      ],
      attributeColumns: [
        { content },
        { title },
        { author }
      ]
    };
    return new Promise(resolve => {
      this.tb.putRow(params, async function (err, data) {
        if (err) {
          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });
  }
  @Func('blog.detail')
  async  detail() {

    const { id } = this.ctx.query;
    const params = {
      tableName: 'blog',
      primaryKey: [{ 'id': id }],
      direction: TableStore.Direction.BACKWARD,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MAX }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MIN }]
    };
    return new Promise(resolve => {
      this.tb.getRow(params, (_, data) => {
        const row = format.row(data.row);
        resolve(row);
      });
    })
  }
  @Func('user.login')
  async  login() {
    
    const { username, password } = this.ctx.request.body;
   
    const params = {
      tableName: 'user',
      primaryKey: [{ username }, { password }],
      direction: TableStore.Direction.BACKWARD
    };
          
         
           return new Promise(resolve => {
      this.tb.getRow(params, async (_, data) => {
           
        await format.row(data.row)
       const  row = format.row(data.row)
        if (row) {
          
          resolve({
            author:row.username,
            success: true
 
          });
        } else {
          resolve({ success: false });
        }


      });
    })
  }
  @Func('user.register')
  async  register() {

    const { username, password } = this.ctx.request.body;

    const params = {
      tableName: "user",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { username }, { password }
      ]

    };
    return new Promise(resolve => {
      this.tb.putRow(params, async function (err, data) {
        if (err) {

          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });



  }

  @Func('render.handler', { middleware: ['fmw:staticFile'] })
  async render() {
    return 'Please refresh this page later.';
  }

  slashes(str) {
    return str.replace(/'/g, '')
  }
}
