
module.exports = async (req, res) => {
    console.log("req.body", req.body)
    console.log("req.query", req.query)
    res.json({success:true})
}