import os

# 定义imgs文件夹路径
imgs_dir = 'imgs'

# 遍历imgs文件夹中的所有文件
for filename in os.listdir(imgs_dir):
    # 获取文件路径
    file_path = os.path.join(imgs_dir, filename)
    
    # 跳过子文件夹
    if os.path.isdir(file_path):
        continue
    
    # 分离文件名和扩展名
    name, ext = os.path.splitext(filename)
    
    # 构建新的文件名（后缀改为.jpg）
    new_filename = name + '.jpg'
    new_file_path = os.path.join(imgs_dir, new_filename)
    
    # 重命名文件
    os.rename(file_path, new_file_path)
    print(f'已将 {filename} 重命名为 {new_filename}')

print('所有文件的后缀已成功改为.jpg')