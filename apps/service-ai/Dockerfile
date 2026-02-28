FROM node:20-alpine
WORKDIR /app
EXPOSE 3003
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.end('ai ok')}).listen(3003,()=>console.log('service-ai stub running on 3003'))"]
