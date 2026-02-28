FROM node:20-alpine
WORKDIR /app
EXPOSE 3005
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.end('notification ok')}).listen(3005,()=>console.log('service-notification stub running on 3005'))"]
