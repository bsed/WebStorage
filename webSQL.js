/// <reference path="Scripts/jquery-1.4.1-vsdoc.js" />

var webStorage = {};
webStorage.webSql = function () {

    var _this = this;

    //数据库
    var _dataBase;

    //打开数据库连接或者创建数据库
    this.openDatabase = function () {

        if (!!_dataBase) {
            return _dataBase;
        }
        _dataBase = openDatabase("student", "1.0", "学生库", 1024 * 1024, function () { });

//        if (!_dataBase) {
//            alert("数据库创建失败！");
//        } else {
//            alert("数据库创建成功！");
//        }
        return _dataBase;

    }




    //创建数据表
    this.createTable = function () {

        var dataBase = _this.openDatabase();
        // 创建表
        dataBase.transaction(function (tx) {
            tx.executeSql(
        "create table if not exists stu (id REAL UNIQUE, name TEXT)",
        [],
        function () { alert('创建stu表成功'); },
        function (tx, error) {
            alert('创建stu表失败:' + error.message);
        });
        });
    }

    //添加数据
    this.insert = function () {
        var dataBase = _this.openDatabase();
        var id = Math.random();
        dataBase.transaction(function (tx) {
            tx.executeSql(
        "insert into stu (id, name) values(?, ?)",
        [id, '徐明祥'],
        function () { alert('添加数据成功'); },
        function (tx, error) {
            alert('添加数据失败: ' + error.message);
        });
        });

    }

    // 查询
    this.query = function () {
        var dataBase = _this.openDatabase();
        dataBase.transaction(function (tx) {
            tx.executeSql(
        "select * from stu", [],
         function (tx, result) {
             //result：SQLResultSet对象。 
             //其定义为：interface SQLResultSet {
             //  readonly attribute long insertId;
             //  readonly attribute long rowsAffected;
             //  readonly attribute SQLResultSetRowList rows;
             //};
             //             alert(result);
             $("#datalist").children().remove();
             for (var i = 0; i < result.rows.length; i++) {


                 var id = result.rows.item(i)['id'];
                 var name = result.rows.item(i)['name'];
                 var $dataItem = $("<div>Id:" + id + "&nbsp;&nbsp;&nbsp;&nbsp;name：" + name + " &nbsp;&nbsp; &nbsp; </div><br/>");

                 $dataItem.append("<a  id='" + id + "' href='javascript:;'>把名字更新为徐明祥</a>&nbsp;");
                 $dataItem.append("<a id='" + id + "' href='javascript:;'>把名字更新为祥叔</a>&nbsp;");
                 $dataItem.append("<a id='" + id + "' href='javascript:;'>删除</a>&nbsp;");
                 $($dataItem.find("a")[0]).click(function () {
                     webSql.update($(this).attr("id"), '徐明祥');
                 });

                 $($dataItem.find("a")[1]).click(function () {
                     webSql.update($(this).attr("id"), '祥叔');
                 });

                 $($dataItem.find("a")[2]).click(function () {
                     webSql.del($(this).attr("id"));
                     _this.query();
                 });

                 $("#datalist").append($dataItem);

             }
         },
        function (tx, error) {
            alert('查询失败: ' + error.message);
        });
        });

    }

    //更新数据
    this.update = function (id, name) {

        var dataBase = _this.openDatabase();
        dataBase.transaction(function (tx) {
            tx.executeSql(
        "update stu set name = ? where id= ?",
        [name, id],
         function (tx, result) {
             _this.query();
         },
        function (tx, error) {
            alert('更新失败: ' + error.message);
        });
        });
    }

    //删除数据
    this.del = function (id) {
        var dataBase = _this.openDatabase();
        dataBase.transaction(function (tx) {
            tx.executeSql(
        "delete from  stu where id= ?",
        [id],
         function (tx, result) {

         },
        function (tx, error) {
            alert('删除失败: ' + error.message);
        });
        });
    }

    //删除数据表
    this.dropTable = function () {
        var dataBase = _this.openDatabase();
        dataBase.transaction(function (tx) {
            tx.executeSql('drop  table  stu');
        });
    }


}