FROM node:20-alpine
WORKDIR /app
EXPOSE 3002
CMD ["node", "-e", "require('http').createServer((_,r)=>{r.end('onboarding ok')}).listen(3002,()=>console.log('service-onboarding stub running on 3002'))"]
