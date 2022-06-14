//node 服务器

//1、引入模块
var http =  require('http');
var fs = require('fs')
var template = require('art-template')
var url = require('url')

var comments = [
  {
    name: '孙权',
    message: '你俩别在我这打~~~',
    dateTime: '2021/4/20上午09:47:06'
  },{
    name: '刘备',
    message: '你来啊，烧死你！！！',
    dateTime: '2021/4/20上午09:45:10'
  },{
    name: '曹操',
    message: '我要渡过长江去打你！！！',
    dateTime: '2021/4/20上午09:44:22'
  }
]
//2、创建服务
http
	.createServer(function(req,resp){
		
	// var url = req.url
	//使用url模块的parse方法得到url对象
	var parseObj = url.parse(req.url,true)
	//使用pathname来做路由判断
	var pathname = parseObj.pathname
	console.log(parseObj)
	//3、服务的核心操作  接收请求  处理数据   发送响应
	if(pathname === '/'){
		fs.readFile('./views/index.html',function(err,data){
			if(err){
				return resp.end('404 not found')
			}
			
			var htmlStr = template.render(data.toString(),{
				// comments:comments
				comments
			})
			
			resp.end(htmlStr)
		})
	} 
	else if(pathname === '/post'){
		fs.readFile('./views/post.html',function(err,data){
			if(err){
				return resp.end('404 not found')
			}
			
			resp.end(data)
		})
	} 
	else if(pathname === '/pinglun'){
		//处理from表单数据
		//响应页面  转发
		//post页面发来的数据
		//分析处理数据   name":"椤圭洰缁勯暱(TL)","message":"sssssssssssssssssss"
		//业务：
		//1、获取表单数据
		//resp.end(JSON.stringify(parseObj.query))
		var comment = parseObj.query
		//2、自己创建日期
		var  day = new Date().toLocaleString();
		console.log(day)
		//3、把数据和日期一起放入comments数组中
		comment.dateTime = day
		// comments.push(comment)
		comments.unshift(comment)
		//4、跳转页面到index
		resp.statusCode = 302; //设置响应头信息的状态码
		resp.setHeader('Location','/')//设置跳转的页面
		resp.end()
	} 
	//如果请求的路径是以/public 开头的，则认为过去的为资源文件
	else if(pathname.indexOf('/public/') === 0){
		fs.readFile('.'+pathname,function(err,data){
			if(err){
				return resp.end('404 not found')
			}
			resp.end(data)
		})
	}
	//其他请求一律认为是错误请求地址，友好提示，404页面
	else {
		fs.readFile('./views/404.html',function(err,data){
			if(err){
				return resp.end('404 not found')
			}
			resp.end(data)
		})
	}
	
})
//4、设置监听端口
	.listen(4000,function(){
	console.log('服务器已启动...')
})
