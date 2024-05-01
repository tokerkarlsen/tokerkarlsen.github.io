$(document).ready(() => {
    Telegram.WebApp.ready();
    const {id, username} = window.Telegram.WebApp.initDataUnsafe.user

    const votedTextArr = [
        'I was better',
        'hehe...',
        'I will win!',
    ];
    const betAmount = 50000;

    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://tokerkarlsen.com/tonconnect-manifest.json',
    });
    tonConnectUI.uiOptions = {
        actionsConfiguration: {
            returnStrategy: 'none'
        },
        twaReturnUrl: 'https://t.me/tokerkarlsen_intervuv'
    };

    async function getUserData(tg_id) {
        // return $.get('API_URL?tg_id=' + tg_id, (response, status) => {
        //     console.log(response, status);
        // },)
        // Возвращает данные юзера, если их нет - создаёт нового юзера и возвращает, сука, данные
        return new Promise((resolve, reject) => {
            resolve({
                user: {
                    tg_id: tg_id,
                    balance: "12345",
                    raw_balance: 12345,
                    voted: false,
                    vote_id: null
                }
            })
        })
    }

    async function postBet(tg_id, bet_id) {
        // return $.post('API_URL', {tg_id: tg_id, bet_id: bet_id}, (response, status) => {
        //     console.log(response, status);
        // },)
        // Отправляет, на кого поставил лудик, возвращает новые данные юзера если не фейл
        return new Promise((resolve, reject) => {
            console.log(bet_id);
            resolve({
                failed: false,
                data: {
                    user: {
                        tg_id: tg_id,
                        balance: "122kk",
                        raw_balance: 122456789,
                        voted: true,
                        vote_id: bet_id
                    }
                }
            })
        })
    }

    function redrawVoted(vote_id) {
        $('.betz .buton button').each((i, obj) => {
            if ($(obj).data('id') === vote_id) {
                $(obj).text('BET DONE!').addClass('cursor-defolt');
                $(obj).off('click')
            } else {
                $(obj).text(votedTextArr[i])
                    .attr('disabled', 'disabled');
            }
        });
        $('#toker').text('whuz nexd huh?');
    }

    async function processWalletConnection(connectedWallet) {
        getUserData(id)
            .then(async (response) => {
                $('#userneim').text(`helo, ${username}`);
                $('#bolance')
                    .removeClass('eror').text(`ur bolance: ${response.user.balance} $TOKER`)
                    .addClass('bolance');
                $('.connecd').off('click').removeClass('connecd')
                $('#ton-connect').addClass('dizconnecd').text('dizconnecd');

                if (response.user.voted) {
                    redrawVoted(response.user.vote_id);
                } else if (response.user.raw_balance >= betAmount) {
                    $('.betz .buton button')
                        .text('PLACA BET')
                        .on('click', (e) => {
                            postBet(response.user.tg_id, $(e.target).data('id'))
                                .then((res) => {
                                    !res.failed && redrawVoted(res.data.user.vote_id)
                                })
                                .catch((error) => {
                                    console.log('Posting the bet failed: ', error);
                                })
                        });
                    $('#toker').text('placa bet gombla!');
                } else {
                    $('.betz .buton button')
                        .text('GET RICH')
                        .on('click', (e) => {
                            Telegram.WebApp.openTelegramLink('https://t.me/tokerkarlsen_bot')
                        });
                    $('#toker').text('make some monee fren');
                }
            })
            .catch((error) => {
                console.error("Error connecting to wallet:", error);
            });
    }

    function connectToWallet() {
        console.log('connecting to wallet');
        tonConnectUI.connectWallet()
            .then((connectedWallet) => processWalletConnection(connectedWallet))
            .catch(error => {
                console.error("Error connecting to wallet:", error);
                processWalletConnection(null)
            });
    }

    function disconnectWallet() {
        tonConnectUI.disconnect();
    }

    $('.connecd').on('click', connectToWallet)
    $('.dizconnecd').on('click', disconnectWallet)
})
