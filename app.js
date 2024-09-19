function loadJSONSync(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); // false 表示同步请求
    xhr.send(null);

    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText); // 解析并返回 JSON 数据
    } else {
        throw new Error("Failed to load JSON: " + xhr.status);
    }
}
// 获取当前 URL
const url = new URL(window.location.href);

// 使用 URLSearchParams 获取参数
const params = new URLSearchParams(url.search);
var ENV = '';
// 获取具体的参数值
const network = params.get('network'); // 'Alice'
if (network=='test') {
    ENV=loadJSONSync('envtest.json');  
} else if (network=='main2') {
    ENV=loadJSONSync('envmain2.json');  
}else{
    ENV=loadJSONSync('env.json');  
}

$(document).ready(async function () {
 


   

    // async function main() {
    //     // 创建提供者
    //     const provider = new ethers.providers.JsonRpcProvider("https://evmtestnet.confluxrpc.com");

    //     // 连接钱包（例如 MetaMask）
    //     const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    //     // 请求用户授权连接钱包
    //     await web3Provider.send("eth_requestAccounts", []);
    // }
    // await main()

    let signer = null;

    let provider;
    if (window.ethereum == null) {

        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()

    } else {

        // // Connect to the MetaMask EIP-1193 object. This is a standard
        // // protocol that allows Ethers access to make all read-only
        // // requests through MetaMask.
        // provider = new ethers.providers.BrowserProvider(window.ethereum)

        // // It also provides an opportunity to request access to write
        // // operations, which will be performed by the private key
        // // that MetaMask manages for the user.
        // signer = await provider.getSigner();
    }
    // 设置你的 RPC URL
    const rpcURL = ENV.rpc; // Infura 的 Mainnet RPC URL
    // const rpcURL = 'http://localhost:8545'; // 本地节点的 RPC URL

    // 初始化 ethers.js 提供者
    provider = new ethers.providers.JsonRpcProvider(rpcURL);
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // 智能合约地址和 ABI
    const contractAddress =  ENV.contractAddress;
    const contractABI =
        // 替换为你的合约 ABI
       [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"option","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BetPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"winningOption","type":"uint256"}],"name":"GameFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"options","type":"uint256"},{"internalType":"string","name":"optionsItem","type":"string"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"createGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"delegatePlaceBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"winningOption","type":"uint256"}],"name":"finalizeGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gameCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"games","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"winningOption","type":"uint256"},{"internalType":"bool","name":"finalized","type":"bool"},{"internalType":"uint256","name":"options","type":"uint256"},{"internalType":"string","name":"optionsItem","type":"string"},{"internalType":"string","name":"tag","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"}],"name":"getBetAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"}],"name":"getBets","outputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"}],"internalType":"struct ESpacePoSPool.Bet[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"getUserBetAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"option","type":"uint256"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"updateAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_adminRatio","type":"uint256"}],"name":"updateAdminRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"newEndTime","type":"uint256"}],"name":"updateEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"options","type":"uint256"}],"name":"updateOptions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"string","name":"optionsItem","type":"string"}],"name":"updateOptionsItem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"updateTag","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        ;

    // 创建合约实例
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // 读取合约中的信息并显示
    const gameId = 0; // 根据需要调整游戏ID
    try {

    } catch (error) {
        console.error('Failed to fetch game data:', error);
    }
    // 获取下注按钮
    const placeBetBtn = $("#place-bet-btn");

    // 监听按钮点击事件
    placeBetBtn.click(function () {
        // 调用下注方法
        let gameId = 0
        let option = 0
        let val = 90
        placeBet(gameId, option, val.toString());
    });

    function Game(id, finalized, name, optionsItem, endTime, arrPool, myArrPool,winningOption,totalBid) {
        this.id = id;
        this.name = name;
        this.optionsItem = optionsItem.split('|');
        this.endTime = endTime;
        this.arrPool = arrPool;
        this.myArrPool = myArrPool
        this.finalized = finalized
        this.expand = false
        this.winningOption=winningOption
        this.totalBid=totalBid
    }
    new Vue({
        el: '#app',
        data: {
            items: [

            ]
        }, async created() {
            setTimeout(async () => {
                // // 获得provider
                // const provider = new ethers.BrowserProvider(window.ethereum)
                // // 读取钱包地址
                // const accounts = await provider.send("eth_requestAccounts", []);
                // const account = accounts[0]
                console.log(999, $('.showAccount').html())
                var myAdd = $('.showAccount').html()
                const gameCount = await contract.gameCount();
                for (let index = 0; index < gameCount; index++) {
                    const game = await contract.games(gameCount - index - 1);
                    var arrPool = []
                    var myArrPool = []
                    var totalBid=0
                    for (let innerIndex = 0; innerIndex < game.options; innerIndex++) {
                        // console.log(95,parseInt(await contract.getBetAmount(game.id,innerIndex) ))
                        let optionBet=ethers.utils.formatEther(await contract.getBetAmount(game.id, innerIndex))
                        arrPool.push(optionBet)
                        totalBid+=parseInt(optionBet)

                        myArrPool.push(ethers.utils.formatEther(await contract.getUserBetAmount(game.id, innerIndex, myAdd)))
                    }
                    this.items.push(
                        new Game(game.id.toString(), game.finalized, game.description, game.optionsItem, new Date(game.endTime.toNumber() * 1000), arrPool, myArrPool,parseInt(game.winningOption),totalBid)
                    )

                    // $('#game-id').text(game.id.toString());
                    // $('#game-description').text(game.description);
                    // $('#optionsItem').text(game.optionsItem);
                    // const date = new Date(game.endTime.toNumber() * 1000); // 假设endTime是Unix时间戳
                    // $('#game-end-time').text(date.toLocaleString());
                }
                console.log('game', this.items)
                // 使用构造函数生成 items 数组
                // this.items = [
                //     new Game(1, 'Apple'),
                //     new Game(2, 'Banana'),
                //     new Game(3, 'Orange'),
                //     new Game(4, 'Grapes'),
                //     new Game(5, 'Watermelon')
                // ]; 
            }, 3000);

        },
        methods: {
            handleItemClick(e, item, optionIndex, value) {
                console.log('点击了', $(e.target).closest('div').find('.bid').val(), item, optionIndex, this);

                placeBet(item.id, optionIndex, parseInt($(e.target).closest('.row').find('.bid').val()).toString());
                // 在这里可以执行其他操作
            },
            handleItemClick2(e, item, optionIndex, value) {
                console.log('点击了', $(e.target).closest('div').find('.bid').val(), item, optionIndex, this);

                placeBet(item.id, optionIndex, parseInt($(e.target).closest('.row').find('.bid').val()).toString(),  ($(e.target).closest('.row').find('.address').val()).toString());
                // 在这里可以执行其他操作
            },
            async calculatePool(id, option) {

                return await contract.getBetAmount(id, option)
            },
            formatDateTime(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
                return formattedDateTime;
            },
            toggleExpand(item) {
                item.expand = !item.expand
            }

        }
    });
    // 下注方法
    function placeBet(gameId, option, val,add) {

        // // 连接以太坊网络
        // const provider = ethers.getDefaultProvider();

        // // 合约地址和ABI
        // const contractAddress = "合约地址";
        // const contractABI = [
        //     // 合约的ABI代码
        // ];

        // // 创建合约实例
        // const contract = new ethers.Contract(contractAddress, contractABI, provider);

if(add){
// 获取用户钱包地址
provider.getSigner().getAddress().then(function (address) {
    // 下注操作
    const value = ethers.utils.parseEther(val); // 将用户输入的下注金额转换为以太
    const transaction = {
        to: contractAddress,
        value: value,
        data: contract.interface.encodeFunctionData("delegatePlaceBet", [gameId, option,add])
    };

    // 发送交易
    provider.getSigner().sendTransaction(transaction).then(function (result) {
        alert("下注交易已发送，等待确认...");

        // 监听交易确认事件
        provider.waitForTransaction(result.hash).then(function (receipt) {
            alert("下注成功！");
        }).catch(function (error) {
            alert("下注失败：", error);
        });
    }).catch(function (error) {
        alert("发送交易失败：" + error.toString());
    });
}).catch(function (error) {
    alert("获取钱包地址失败：", error);
});

}else{
// 获取用户钱包地址
provider.getSigner().getAddress().then(function (address) {
    // 下注操作
    const value = ethers.utils.parseEther(val); // 将用户输入的下注金额转换为以太
    const transaction = {
        to: contractAddress,
        value: value,
        data: contract.interface.encodeFunctionData("placeBet", [gameId, option])
    };

    // 发送交易
    provider.getSigner().sendTransaction(transaction).then(function (result) {
        alert("下注交易已发送，等待确认...");

        // 监听交易确认事件
        provider.waitForTransaction(result.hash).then(function (receipt) {
            alert("下注成功！");
        }).catch(function (error) {
            alert("下注失败：", error);
        });
    }).catch(function (error) {
        alert("发送交易失败：" + error.toString());
    });
}).catch(function (error) {
    alert("获取钱包地址失败：", error);
});

}
        

        // // 下注操作
        // const signer = provider.getSigner();
        // const value = ethers.utils.parseEther("10"); // 下注10个ETH
        // const transaction = contract.connect(signer).placeBet(gameId, option, { value: value });

        // // 发送交易
        // transaction.then(function (result) {
        //     console.log("下注成功！");
        // }).catch(function (error) {
        //     console.log("下注失败：", error);
        // });
    }

});