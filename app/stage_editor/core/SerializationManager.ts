import type { EditorStageData } from '../types/stage-editor';
import { createDefaultStageData } from './StageEditorState';

export class SerializationManager {
  
  /**
   * 現在のステージデータをJSON文字列に変換します
   */
  public static exportToJson(data: EditorStageData): string {
    // 念のためディープコピーしてから不要なVueのリアクティブプロパティ等を削る
    const cleanData: EditorStageData = JSON.parse(JSON.stringify(data));
    
    return JSON.stringify(cleanData, null, 2);
  }

  /**
   * JSON文字列からステージデータを復元します
   */
  public static importFromJson(jsonString: string): EditorStageData | null {
    try {
      const parsedData = JSON.parse(jsonString) as Partial<EditorStageData>;
      
      // 不正なデータの場合はデフォルトにマージするなどの簡単なバリデーション
      const baseData = createDefaultStageData();
      
      return {
        ...baseData,
        ...parsedData,
        player: { ...baseData.player, ...parsedData.player },
        enemies: parsedData.enemies || []
      };
    } catch (e) {
      console.error('Failed to parse stage JSON', e);
      return null;
    }
  }

  /**
   * ブラウザ上でファイルをダウンロードさせるヘルパー
   */
  public static downloadJsonFile(jsonString: string, filename: string = 'stage-data.json') {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * ユーザーにファイルを選択させて読み込むヘルパー
   */
  public static async loadJsonFile(file: File): Promise<EditorStageData | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          resolve(SerializationManager.importFromJson(content));
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
  }
}
