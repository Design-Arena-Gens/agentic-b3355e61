import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { sessionId, newName } = req.body;

  if (!sessionId || !newName) {
    return res.status(400).json({
      success: false,
      message: 'Session ID and new name are required'
    });
  }

  if (newName.length < 2 || newName.length > 30) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 30 characters'
    });
  }

  try {
    const response = await fetch('https://www.tiktok.com/api/user/update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sessionid=${sessionId}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/settings',
        'Origin': 'https://www.tiktok.com',
      },
      body: JSON.stringify({
        nickName: newName,
      }),
    });

    const data = await response.json();

    if (response.ok && data.status_code === 0) {
      return res.status(200).json({
        success: true,
        message: 'Name changed successfully!',
        data: data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.status_msg || 'Failed to change name. Please check your session ID and try again.',
        data: data
      });
    }
  } catch (error: any) {
    console.error('Error changing TikTok name:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while changing the name. Please try again.'
    });
  }
}
