module.exports=function(Users,async,Group){
    return {
        Request:function(req,res){
            async.parallel([
                function(callback){
                   if(req.body.receiverName){
                       Users.updateOne({
                           'username':req.body.receiverName,
                           'request.userId':{$ne:req.user._id},
                           "friendList.friendId":{$ne:req.user._id}
                       },
                       {
                           $push:{
                               request:{
                               userId:req.user._id,
                               username:req.user.username
                                }
                            },
                            $inc:{totalRequest:1}
                       },function(err,count){
                           callback(err,count);
                       })
                   } 
                },
                function(callback){
                    if(req.body.receiverName){
                        Users.updateOne({
                            'username':req.user.username,
                            "sentRequest.username":{$ne:req.body.receiverName}
                        },{
                            $push:{
                                sentRequest:{
                                    username:req.body.receiverName
                                }
                            }
                        },function(err,count){
                            callback(err,count);
                        })
                    }
                }
            ],function(err,results){
                res.redirect("/group/"+req.params.name);
            });
            async.parallel([
                function(callback){
                    if(req.body.senderName){
                        Users.updateOne({
                            '_id':req.user._id,
                            "friendList.friendId":{$ne:req.body.senderId},
                            "username":req.user.username,
                        },{
                            $push:{
                                friendList:{
                                    friendId:req.body.senderId,
                                    friendName:req.body.senderName
                                }
                            },
                            $inc:{totalRequest:-1},
                            $pull:{
                                request:{
                                    userId:req.body.senderId,
                                    username:req.body.senderName
                                }
                            }
                        },function(err,count){
                            callback(err,count);
                        })
                    }
                },
                function(callback){
                    if(req.body.senderName){
                        Users.updateOne({
                            '_id':req.body.senderId,
                            'friendList.friendId':{$ne:req.user._id}
                        },{
                            $push:{
                                friendList:{
                                    friendId:req.user._id,
                                    friendName:req.user.username
                                }
                            },
                            $pull:{
                                sentRequest:{
                                    username:req.user.username
                                }
                            }
                        },function(err,count){
                            callback(err,count);
                        })
                    }
                },
                function(callback){
                    if(req.body.sender_Id){
                        Users.updateOne({
                            '_id':req.user._id,
                            'request.username':{$eq:req.body.sender_Name}
                        },{
                            $pull:{
                                request:{
                                    userId:req.body.sender_Id,
                                    username:req.body.sender_Name
                                }
                            },
                            $inc:{
                                totalRequest:-1
                            }
                        },function(err,count){
                            callback(err,count);
                        })
                    }
                },
                function(callback){
                    if(req.body.sender_Id){
                        Users.updateOne({
                            'id':req.body.sender_Id,
                            "sentRequest.username":{$eq:req.user.username}
                        },{
                            $pull:{
                                sentRequest:{
                                    username:req.user.username
                                }
                            }
                        },function(err,count){
                            callback(err,count);
                        })
                    }
                }
            ],function(err,results){
                res.redirect("/group/"+req.params.name);
            })
        }
    }
}