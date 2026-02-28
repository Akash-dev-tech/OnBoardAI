FROM node:20-alpine
WORKDIR /app
EXPOSE 3004
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.end('analytics ok')}).listen(3004,()=>console.log('service-analytics stub running on 3004'))"]
