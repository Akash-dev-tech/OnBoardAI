FROM node:20-alpine
WORKDIR /app
EXPOSE 3000
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.end('api-gateway ok')}).listen(3000,()=>console.log('api-gateway stub running on 3000'))"]
