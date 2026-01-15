function viewLogTranslationTag(rec) {
  return `ui-inventory-import.button.view-log.${rec.currentStatus === 'RUNNING' ? 'current' : 'last'}`;
}

export default viewLogTranslationTag;
