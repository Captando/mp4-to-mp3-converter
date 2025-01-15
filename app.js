const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const play = require('play-dl');
const path = require('path');
const fs = require('fs');

// Configurar o caminho do FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(express.json());

// Obter o diretório atual da aplicação
const appDir = path.resolve(__dirname);

// Configurar diretórios com caminhos absolutos
const uploadsDir = path.join(appDir, 'uploads');
const outputDir = path.join(appDir, 'output');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Arquivo não suportado. Envie apenas vídeos.'));
        }
    }
});

// Criar diretórios necessários
[uploadsDir, outputDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Função de conversão MP4 para MP3
function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('mp3')
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}

// Função para baixar áudio do YouTube
async function downloadYouTubeAudio(url, outputPath) {
    try {
        // Verificar se a URL é válida
        const yt_info = await play.video_info(url);
        const stream = await play.stream_from_info(yt_info);
        
        return new Promise((resolve, reject) => {
            const inputStream = stream.stream;
            ffmpeg(inputStream)
                .toFormat('mp3')
                .on('end', () => {
                    resolve(yt_info.video_details.title);
                })
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    } catch (error) {
        throw new Error(`Erro ao processar URL do YouTube: ${error.message}`);
    }
}

// Limpar arquivos temporários
function cleanupFiles(...files) {
    files.forEach(file => {
        if (file && fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

// Rota para upload e conversão de arquivo
app.post('/convert/file', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const inputPath = req.file.path;
    const outputFileName = `${Date.now()}.mp3`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
        await convertToMp3(inputPath, outputPath);
        res.download(outputPath, outputFileName, (err) => {
            if (err) {
                console.error('Erro ao enviar arquivo:', err);
            }
            cleanupFiles(inputPath, outputPath);
        });
    } catch (err) {
        console.error('Erro na conversão:', err);
        cleanupFiles(inputPath);
        res.status(500).json({ error: 'Erro na conversão do arquivo' });
    }
});

// Rota para conversão de URL do YouTube
app.post('/convert/youtube', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida' });
    }

    const outputFileName = `${Date.now()}.mp3`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
        console.log('Iniciando download do YouTube...');
        console.log('URL:', url);
        
        const videoTitle = await downloadYouTubeAudio(url, outputPath);
        const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3';

        res.download(outputPath, safeTitle, (err) => {
            if (err) {
                console.error('Erro ao enviar arquivo:', err);
            }
            cleanupFiles(outputPath);
        });
    } catch (err) {
        console.error('Erro no processamento:', err);
        cleanupFiles(outputPath);
        res.status(500).json({ error: `Erro ao processar o vídeo: ${err.message}` });
    }
});

// Rota de healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        version: '1.0.0',
        author: 'Captando',
        github: 'https://github.com/Captando'
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});